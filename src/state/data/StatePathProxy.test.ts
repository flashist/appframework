import { describe, it, expect, beforeEach } from 'vitest';
import { createStatePathProxy, StatePathProxy } from './StatePathProxy';
import { IStatePathStorage, StatePath } from './StatePath';

// Test state types
interface TestItem {
    id: number;
    name: string;
    active: boolean;
}

interface TestEnemy {
    health: number;
    type: string;
}

interface TestLevel {
    name: string;
    enemies: TestEnemy[];
}

interface TestState {
    user: {
        profile: {
            name: string;
            age: number;
        };
        settings: {
            theme: string;
        };
    };
    items: TestItem[];
    levels: TestLevel[];
    tags: string[];
    count: number;
}

/**
 * Mock storage implementation for testing
 */
class MockStateStorage implements IStatePathStorage {
    public state: any = {};
    public operations: { method: string; path: string; args?: any[] }[] = [];

    constructor(initialState: any = {}) {
        this.state = initialState;
    }

    private getNestedValue(path: string): any {
        if (!path) return this.state;
        const parts = path.split('.');
        let current = this.state;
        for (const part of parts) {
            if (current === undefined || current === null) return undefined;
            current = current[part];
        }
        return current;
    }

    private setNestedValue(path: string, value: any): void {
        if (!path) {
            this.state = value;
            return;
        }
        const parts = path.split('.');
        let current = this.state;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (current[part] === undefined) {
                current[part] = {};
            }
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    }

    getValueByPath(path: string): any {
        this.operations.push({ method: 'get', path });
        return this.getNestedValue(path);
    }

    changeByPath(path: string, value: any): void {
        this.operations.push({ method: 'change', path, args: [value] });
        const existing = this.getNestedValue(path);
        if (typeof existing === 'object' && typeof value === 'object' && existing !== null && value !== null) {
            this.setNestedValue(path, { ...existing, ...value });
        } else {
            this.setNestedValue(path, value);
        }
    }

    substituteByPath(path: string, value: any): void {
        this.operations.push({ method: 'substitute', path, args: [value] });
        this.setNestedValue(path, value);
    }

    deleteByPath(path: string): any {
        this.operations.push({ method: 'delete', path });
        const value = this.getNestedValue(path);
        const parts = path.split('.');
        const key = parts.pop()!;
        const parent = parts.length ? this.getNestedValue(parts.join('.')) : this.state;
        if (parent && typeof parent === 'object') {
            delete parent[key];
        }
        return value;
    }

    pushByPath(path: string, ...elements: any[]): void {
        this.operations.push({ method: 'push', path, args: elements });
        const arr = this.getNestedValue(path);
        if (Array.isArray(arr)) {
            arr.push(...elements);
        }
    }

    spliceByPath(path: string, start: number, deleteCount?: number): any[] {
        this.operations.push({ method: 'splice', path, args: [start, deleteCount] });
        const arr = this.getNestedValue(path);
        if (Array.isArray(arr)) {
            return deleteCount !== undefined
                ? arr.splice(start, deleteCount)
                : arr.splice(start);
        }
        return [];
    }

    reset(): void {
        this.operations = [];
    }

    /**
     * Type-safe path builder API (mirrors AppStateStorage.$())
     */
    $<StateType extends object>(): StatePathProxy<StateType, StateType> {
        return createStatePathProxy<StateType>(this);
    }
}

describe('StatePathProxy', () => {
    let storage: MockStateStorage;

    beforeEach(() => {
        storage = new MockStateStorage({
            user: {
                profile: {
                    name: 'Alice',
                    age: 28
                },
                settings: {
                    theme: 'dark'
                }
            },
            items: [
                { id: 1, name: 'Sword', active: true },
                { id: 2, name: 'Shield', active: false }
            ],
            levels: [
                {
                    name: 'Forest',
                    enemies: [
                        { health: 50, type: 'wolf' },
                        { health: 100, type: 'bear' }
                    ]
                }
            ],
            tags: ['adventure', 'rpg'],
            count: 42
        });
    });

    describe('Proxy Behavior', () => {
        it('should create proxy at root level', () => {
            const proxy = storage.$<TestState>();
            expect(proxy.path).toBe('');
        });

        it('should intercept property access and build path', () => {
            const proxy = storage.$<TestState>();
            const userProxy = proxy.user;
            expect(userProxy.path).toBe('user');
        });

        it('should build nested paths through chained property access', () => {
            const proxy = storage.$<TestState>();
            expect(proxy.user.profile.name.path).toBe('user.profile.name');
        });

        it('should expose StatePath methods through proxy', () => {
            const proxy = storage.$<TestState>();
            // Verify methods exist
            expect(typeof proxy.get).toBe('function');
            expect(typeof proxy.set).toBe('function');
            expect(typeof proxy.replace).toBe('function');
            expect(typeof proxy.remove).toBe('function');
            expect(typeof proxy.push).toBe('function');
            expect(typeof proxy.splice).toBe('function');
            expect(typeof proxy.at).toBe('function');
            expect(typeof proxy.prop).toBe('function');
        });

        it('should handle symbol properties correctly', () => {
            const proxy = storage.$<TestState>();
            // Symbols should be passed through to the underlying StatePath
            // This primarily tests that we don't crash on symbol access
            const symbol = Symbol('test');
            expect(() => (proxy as any)[symbol]).not.toThrow();
        });
    });

    describe('Terminal Operations Through Proxy', () => {
        describe('get()', () => {
            it('should get primitive value', () => {
                const proxy = storage.$<TestState>();
                expect(proxy.user.profile.name.get()).toBe('Alice');
            });

            it('should get object value', () => {
                const proxy = storage.$<TestState>();
                expect(proxy.user.profile.get()).toEqual({ name: 'Alice', age: 28 });
            });

            it('should get array', () => {
                const proxy = storage.$<TestState>();
                expect(proxy.tags.get()).toEqual(['adventure', 'rpg']);
            });

            it('should get number value', () => {
                const proxy = storage.$<TestState>();
                expect(proxy.count.get()).toBe(42);
            });
        });

        describe('set()', () => {
            it('should set primitive value through proxy', () => {
                const proxy = storage.$<TestState>();
                proxy.user.profile.name.set('Bob' as any);

                expect(storage.operations).toContainEqual({
                    method: 'change',
                    path: 'user.profile.name',
                    args: ['Bob']
                });
            });

            it('should set object value through proxy', () => {
                const proxy = storage.$<TestState>();
                proxy.user.settings.set({ theme: 'light' } as any);

                expect(storage.operations).toContainEqual({
                    method: 'change',
                    path: 'user.settings',
                    args: [{ theme: 'light' }]
                });
            });
        });

        describe('replace()', () => {
            it('should replace value through proxy', () => {
                const proxy = storage.$<TestState>();
                proxy.user.profile.replace({ name: 'Charlie', age: 35 } as any);

                expect(storage.operations).toContainEqual({
                    method: 'substitute',
                    path: 'user.profile',
                    args: [{ name: 'Charlie', age: 35 }]
                });
            });
        });

        describe('remove()', () => {
            it('should remove value through proxy', () => {
                const proxy = storage.$<TestState>();
                const removed = proxy.user.profile.age.remove();

                expect(storage.operations).toContainEqual({
                    method: 'delete',
                    path: 'user.profile.age'
                });
                expect(removed).toBe(28);
            });
        });
    });

    describe('Array Operations Through Proxy', () => {
        describe('at()', () => {
            it('should access array element via at()', () => {
                const proxy = storage.$<TestState>();
                const item = proxy.items.at(0);
                expect(item.path).toBe('items.0');
            });

            it('should access array element property via at()', () => {
                const proxy = storage.$<TestState>();
                expect(proxy.items.at(0).name.path).toBe('items.0.name');
                expect(proxy.items.at(0).name.get()).toBe('Sword');
            });

            it('should access nested array via at()', () => {
                const proxy = storage.$<TestState>();
                expect(proxy.levels.at(0).enemies.at(1).health.path).toBe('levels.0.enemies.1.health');
                expect(proxy.levels.at(0).enemies.at(1).health.get()).toBe(100);
            });

            it('should set value on array element via at()', () => {
                const proxy = storage.$<TestState>();
                proxy.items.at(0).active.set(false as any);

                expect(storage.operations).toContainEqual({
                    method: 'change',
                    path: 'items.0.active',
                    args: [false]
                });
            });

            it('should replace array element via at()', () => {
                const proxy = storage.$<TestState>();
                proxy.items.at(1).replace({ id: 99, name: 'Axe', active: true } as any);

                expect(storage.operations).toContainEqual({
                    method: 'substitute',
                    path: 'items.1',
                    args: [{ id: 99, name: 'Axe', active: true }]
                });
            });
        });

        describe('push()', () => {
            it('should push to array through proxy', () => {
                const proxy = storage.$<TestState>();
                proxy.items.push({ id: 3, name: 'Bow', active: true } as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'items',
                    args: [{ id: 3, name: 'Bow', active: true }]
                });
            });

            it('should push to nested array through proxy', () => {
                const proxy = storage.$<TestState>();
                proxy.levels.at(0).enemies.push({ health: 75, type: 'snake' } as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'levels.0.enemies',
                    args: [{ health: 75, type: 'snake' }]
                });
            });

            it('should push to string array', () => {
                const proxy = storage.$<TestState>();
                proxy.tags.push('multiplayer' as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'tags',
                    args: ['multiplayer']
                });
            });
        });

        describe('splice()', () => {
            it('should splice array through proxy', () => {
                const proxy = storage.$<TestState>();
                const removed = proxy.items.splice(0, 1);

                expect(storage.operations).toContainEqual({
                    method: 'splice',
                    path: 'items',
                    args: [0, 1]
                });
                expect(removed).toEqual([{ id: 1, name: 'Sword', active: true }]);
            });

            it('should splice nested array through proxy', () => {
                const proxy = storage.$<TestState>();
                const removed = proxy.levels.at(0).enemies.splice(1, 1);

                expect(storage.operations).toContainEqual({
                    method: 'splice',
                    path: 'levels.0.enemies',
                    args: [1, 1]
                });
                expect(removed).toEqual([{ health: 100, type: 'bear' }]);
            });
        });
    });

    describe('Integration with StatePath', () => {
        it('should work identically to StatePath for simple paths', () => {
            const proxy = storage.$<TestState>();
            const statePath = new StatePath<TestState, TestState>(storage)
                .prop('user')
                .prop('profile')
                .prop('name');

            expect(proxy.user.profile.name.path).toBe(statePath.path);
            expect(proxy.user.profile.name.get()).toBe(statePath.get());
        });

        it('should work identically to StatePath for array paths', () => {
            const proxy = storage.$<TestState>();
            const statePath = new StatePath<TestState, TestState>(storage)
                .prop('items')
                .at(0)
                .prop('name');

            expect(proxy.items.at(0).name.path).toBe(statePath.path);
            expect(proxy.items.at(0).name.get()).toBe(statePath.get());
        });

        it('should allow mixing proxy access with prop() method', () => {
            const proxy = storage.$<TestState>();
            // Can use both proxy syntax and prop() method
            expect(proxy.user.prop('profile').name.path).toBe('user.profile.name');
            expect(proxy.prop('user').profile.prop('name').path).toBe('user.profile.name');
        });
    });

    describe('Edge Cases', () => {
        it('should handle accessing properties that match StatePath method names', () => {
            // Test state where property name is same as method name
            interface MethodNameState {
                get: string;
                set: number;
                path: boolean;
            }

            const methodStorage = new MockStateStorage({
                get: 'getValue',
                set: 123,
                path: true
            });

            const proxy = methodStorage.$<MethodNameState>();

            // Methods should take precedence over properties
            expect(typeof proxy.get).toBe('function');
            expect(typeof proxy.set).toBe('function');
            // 'path' is a getter on StatePath, should return the path string
            expect(proxy.path).toBe('');
        });

        it('should handle undefined values gracefully', () => {
            const proxy = storage.$<TestState>();
            expect(proxy.user.profile.name.get()).toBe('Alice');

            // Accessing non-existent path should return undefined when calling get()
            const nonExistent = (proxy as any).nonexistent.deep.nested;
            expect(nonExistent.get()).toBeUndefined();
            expect(nonExistent.path).toBe('nonexistent.deep.nested');
        });

        it('should handle multiple independent proxy chains', () => {
            const proxy = storage.$<TestState>();

            const chain1 = proxy.user.profile.name;
            const chain2 = proxy.user.settings.theme;
            const chain3 = proxy.items.at(0).name;

            expect(chain1.path).toBe('user.profile.name');
            expect(chain2.path).toBe('user.settings.theme');
            expect(chain3.path).toBe('items.0.name');

            // All chains should work independently
            expect(chain1.get()).toBe('Alice');
            expect(chain2.get()).toBe('dark');
            expect(chain3.get()).toBe('Sword');
        });

        it('should handle repeated access without side effects', () => {
            const proxy = storage.$<TestState>();

            // Access same path multiple times
            const path1 = proxy.user.profile.name.path;
            const path2 = proxy.user.profile.name.path;
            const path3 = proxy.user.profile.name.path;

            expect(path1).toBe(path2);
            expect(path2).toBe(path3);
        });
    });

    describe('Complex Scenarios', () => {
        it('should handle modifying deeply nested array elements', () => {
            const proxy = storage.$<TestState>();

            // Modify enemy health in nested structure
            proxy.levels.at(0).enemies.at(0).health.set(25 as any);

            expect(storage.operations).toContainEqual({
                method: 'change',
                path: 'levels.0.enemies.0.health',
                args: [25]
            });
        });

        it('should handle multiple operations in sequence', () => {
            const proxy = storage.$<TestState>();

            // Perform multiple operations
            proxy.user.profile.name.set('Updated' as any);
            proxy.items.push({ id: 10, name: 'New Item', active: true } as any);
            proxy.levels.at(0).enemies.splice(0, 1);

            expect(storage.operations).toHaveLength(3);
            expect(storage.operations[0].method).toBe('change');
            expect(storage.operations[1].method).toBe('push');
            expect(storage.operations[2].method).toBe('splice');
        });

        it('should work with prop() after at()', () => {
            const proxy = storage.$<TestState>();

            const enemyType = proxy.levels.at(0).enemies.at(1).prop('type');
            expect(enemyType.path).toBe('levels.0.enemies.1.type');
            expect(enemyType.get()).toBe('bear');
        });
    });
});
