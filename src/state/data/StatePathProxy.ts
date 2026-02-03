import { StatePath, IStatePathStorage } from "./StatePath";

type PropertyProxy<Root, Current> = Current extends object
    ? StatePathProxy<Root, Current>
    : StatePath<Root, Current>;

/**
 * Proxy wrapper that enables property access syntax:
 * storage.$<State>().user.profile.name.set("value")
 *
 * Uses ES6 Proxy to intercept property access and build paths incrementally.
 * This approach avoids type explosion because types are computed one step at a time,
 * rather than computing ALL possible paths at compile time.
 *
 * @typeParam Root - The root state type
 * @typeParam Current - The type at the current path position
 */
export type StatePathProxy<Root, Current> = StatePath<Root, Current> & {
    readonly [K in keyof Current & (string | number)]: PropertyProxy<Root, Current[K]>;
};

/**
 * Creates a proxy-wrapped StatePath that enables property access syntax.
 *
 * @param storage - The storage implementation (AppStateStorage)
 * @param pathParts - Current path parts (empty for root)
 * @returns A proxy that intercepts property access to build paths
 *
 * @example
 * const proxy = createStatePathProxy<MyState>(storage);
 * proxy.user.profile.name.set("John"); // Builds path "user.profile.name"
 */
export function createStatePathProxy<Root, Current = Root>(
    storage: IStatePathStorage,
    pathParts: string[] = []
): StatePathProxy<Root, Current> {
    const statePath = new StatePath<Root, Current>(storage, pathParts);

    return new Proxy(statePath, {
        get(target: StatePath<Root, Current>, prop: string | symbol) {
            // Handle symbol properties
            if (typeof prop === "symbol") {
                return (target as any)[prop];
            }

            // Wrap at() and prop() methods to return proxies
            if (prop === "at") {
                return (index: number) => createStatePathProxy<Root, any>(
                    storage,
                    [...pathParts, String(index)]
                );
            }

            if (prop === "prop") {
                return (key: string | number) => createStatePathProxy<Root, any>(
                    storage,
                    [...pathParts, String(key)]
                );
            }

            // Return other StatePath methods and properties directly
            if (prop in target) {
                return (target as any)[prop];
            }

            // Property access - create new proxy for nested path
            return createStatePathProxy<Root, any>(
                storage,
                [...pathParts, String(prop)]
            );
        }
    }) as StatePathProxy<Root, Current>;
}
