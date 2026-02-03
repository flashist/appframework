import { DeepPartial } from "./DeepPartialTypings";

/**
 * Interface for storage operations (implemented by AppStateStorage).
 * Enables the StatePath class to perform actual state operations.
 */
export interface IStatePathStorage {
    getValueByPath(path: string): any;
    changeByPath(path: string, value: any): void;
    substituteByPath(path: string, value: any): void;
    deleteByPath(path: string): any;
    pushByPath(path: string, ...elements: any[]): void;
    spliceByPath(path: string, start: number, deleteCount?: number): any[];
}

/**
 * Type-safe path builder for state access.
 * Builds paths incrementally to avoid type explosion with arrays.
 *
 * @example
 * // Access nested properties:
 * storage.$<MyState>().user.profile.name.set("John");
 *
 * // Access array elements:
 * storage.$<MyState>().items.at(0).value.set(42);
 *
 * // Get values:
 * const name = storage.$<MyState>().user.name.get();
 *
 * @typeParam Root - The root state type (used for type tracking)
 * @typeParam Current - The type at the current path position
 */
export class StatePath<Root, Current> {
    constructor(
        private readonly storage: IStatePathStorage,
        private readonly pathParts: string[] = []
    ) {}

    /** Get the built path string (for debugging/events) */
    get path(): string {
        return this.pathParts.join(".");
    }

    /** Access a property - returns StatePath for the property type */
    prop<K extends keyof Current & (string | number)>(key: K): StatePath<Root, Current[K]> {
        return new StatePath<Root, Current[K]>(
            this.storage,
            [...this.pathParts, String(key)]
        );
    }

    /**
     * Access array element by index - no type explosion since index is runtime.
     * @param index - The array index to access
     */
    at<T = Current extends readonly (infer U)[] ? U : never>(
        index: number
    ): StatePath<Root, T> {
        return new StatePath<Root, T>(
            this.storage,
            [...this.pathParts, String(index)]
        );
    }

    // === Terminal Operations ===

    /** Get the value at this path */
    get(): Current {
        return this.storage.getValueByPath(this.path);
    }

    /** Change (merge) value at this path */
    set(value: DeepPartial<Current>): void {
        this.storage.changeByPath(this.path, value);
    }

    /** Substitute (replace) value at this path */
    replace(value: DeepPartial<Current>): void {
        this.storage.substituteByPath(this.path, value);
    }

    /** Delete value at this path */
    remove(): Current {
        return this.storage.deleteByPath(this.path);
    }

    // === Array Operations (when Current is an array) ===

    /** Push elements (only when Current is an array) */
    push<T = Current extends readonly (infer U)[] ? U : never>(
        ...elements: T[]
    ): void {
        this.storage.pushByPath(this.path, ...elements);
    }

    /** Splice array (only when Current is an array) */
    splice(start: number, deleteCount?: number): any[] {
        return this.storage.spliceByPath(this.path, start, deleteCount);
    }
}
