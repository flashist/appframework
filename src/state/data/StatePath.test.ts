import { describe, it, expect, beforeEach } from 'vitest';
import { StatePath, IStatePathStorage } from './StatePath';

// Test state types
interface TestItem {
    id: number;
    name: string;
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
    };
    items: TestItem[];
    levels: TestLevel[];
    tags: string[];
    matrix: number[][];
}

/**
 * Mock storage that tracks all operations for verification
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
}

describe('StatePath', () => {
    let storage: MockStateStorage;

    beforeEach(() => {
        storage = new MockStateStorage({
            user: {
                profile: {
                    name: 'John',
                    age: 30
                }
            },
            items: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' }
            ],
            levels: [
                {
                    name: 'Level 1',
                    enemies: [
                        { health: 100, type: 'goblin' },
                        { health: 200, type: 'orc' }
                    ]
                }
            ],
            tags: ['tag1', 'tag2', 'tag3'],
            matrix: [[1, 2], [3, 4], [5, 6]]
        });
    });

    describe('Path Building', () => {
        it('should build empty path at root', () => {
            const path = new StatePath<TestState, TestState>(storage);
            expect(path.path).toBe('');
        });

        it('should build path with single property', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('user');
            expect(path.path).toBe('user');
        });

        it('should build path with nested properties', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('user')
                .prop('profile')
                .prop('name');
            expect(path.path).toBe('user.profile.name');
        });

        it('should build path with array index using at()', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('items')
                .at(0);
            expect(path.path).toBe('items.0');
        });

        it('should build path with chained at() calls', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('matrix')
                .at(1)
                .at(0);
            expect(path.path).toBe('matrix.1.0');
        });

        it('should build path with mixed property and array access', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('levels')
                .at(0)
                .prop('enemies')
                .at(1)
                .prop('health');
            expect(path.path).toBe('levels.0.enemies.1.health');
        });

        it('should build path with property after at()', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('items')
                .at(0)
                .prop('name');
            expect(path.path).toBe('items.0.name');
        });
    });

    describe('Terminal Operations', () => {
        describe('get()', () => {
            it('should get value at simple path', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('user')
                    .prop('profile')
                    .prop('name');
                expect(path.get()).toBe('John');
            });

            it('should get value at array index', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items')
                    .at(0)
                    .prop('name');
                expect(path.get()).toBe('Item 1');
            });

            it('should get nested array element', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('levels')
                    .at(0)
                    .prop('enemies')
                    .at(1)
                    .prop('health');
                expect(path.get()).toBe(200);
            });

            it('should get entire array', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('tags');
                expect(path.get()).toEqual(['tag1', 'tag2', 'tag3']);
            });

            it('should get matrix element', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('matrix')
                    .at(2)
                    .at(1);
                expect(path.get()).toBe(6);
            });

            it('should return undefined for non-existent path', () => {
                const path = new StatePath<TestState, any>(storage, ['nonexistent', 'path']);
                expect(path.get()).toBeUndefined();
            });
        });

        describe('set()', () => {
            it('should set value at simple path', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('user')
                    .prop('profile')
                    .prop('name');
                path.set('Jane' as any);

                expect(storage.operations).toContainEqual({
                    method: 'change',
                    path: 'user.profile.name',
                    args: ['Jane']
                });
                expect(storage.state.user.profile.name).toBe('Jane');
            });

            it('should set value at array index', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items')
                    .at(1)
                    .prop('name');
                path.set('Updated Item' as any);

                expect(storage.operations).toContainEqual({
                    method: 'change',
                    path: 'items.1.name',
                    args: ['Updated Item']
                });
                expect(storage.state.items[1].name).toBe('Updated Item');
            });

            it('should set nested array element property', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('levels')
                    .at(0)
                    .prop('enemies')
                    .at(0)
                    .prop('health');
                path.set(50 as any);

                expect(storage.operations).toContainEqual({
                    method: 'change',
                    path: 'levels.0.enemies.0.health',
                    args: [50]
                });
                expect(storage.state.levels[0].enemies[0].health).toBe(50);
            });
        });

        describe('replace()', () => {
            it('should replace value at path', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('user')
                    .prop('profile');
                path.replace({ name: 'New', age: 25 } as any);

                expect(storage.operations).toContainEqual({
                    method: 'substitute',
                    path: 'user.profile',
                    args: [{ name: 'New', age: 25 }]
                });
            });

            it('should replace entire array element', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items')
                    .at(0);
                path.replace({ id: 99, name: 'Replaced' } as any);

                expect(storage.operations).toContainEqual({
                    method: 'substitute',
                    path: 'items.0',
                    args: [{ id: 99, name: 'Replaced' }]
                });
            });
        });

        describe('remove()', () => {
            it('should remove value at path', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('user')
                    .prop('profile')
                    .prop('age');
                const removed = path.remove();

                expect(storage.operations).toContainEqual({
                    method: 'delete',
                    path: 'user.profile.age'
                });
                expect(removed).toBe(30);
                expect(storage.state.user.profile.age).toBeUndefined();
            });

            it('should remove array element', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items')
                    .at(1);
                const removed = path.remove();

                expect(storage.operations).toContainEqual({
                    method: 'delete',
                    path: 'items.1'
                });
                expect(removed).toEqual({ id: 2, name: 'Item 2' });
            });
        });
    });

    describe('Array Operations', () => {
        describe('push()', () => {
            it('should push single element to array', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items');
                path.push({ id: 4, name: 'Item 4' } as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'items',
                    args: [{ id: 4, name: 'Item 4' }]
                });
                expect(storage.state.items).toHaveLength(4);
                expect(storage.state.items[3]).toEqual({ id: 4, name: 'Item 4' });
            });

            it('should push multiple elements to array', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('tags');
                path.push('tag4' as any, 'tag5' as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'tags',
                    args: ['tag4', 'tag5']
                });
                expect(storage.state.tags).toHaveLength(5);
            });

            it('should push to nested array via at()', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('levels')
                    .at(0)
                    .prop('enemies');
                path.push({ health: 150, type: 'troll' } as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'levels.0.enemies',
                    args: [{ health: 150, type: 'troll' }]
                });
                expect(storage.state.levels[0].enemies).toHaveLength(3);
            });

            it('should push to array of arrays', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('matrix');
                path.push([7, 8] as any);

                expect(storage.operations).toContainEqual({
                    method: 'push',
                    path: 'matrix',
                    args: [[7, 8]]
                });
                expect(storage.state.matrix).toHaveLength(4);
            });
        });

        describe('splice()', () => {
            it('should splice elements from array', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items');
                const removed = path.splice(1, 1);

                expect(storage.operations).toContainEqual({
                    method: 'splice',
                    path: 'items',
                    args: [1, 1]
                });
                expect(removed).toEqual([{ id: 2, name: 'Item 2' }]);
                expect(storage.state.items).toHaveLength(2);
            });

            it('should splice multiple elements', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('tags');
                const removed = path.splice(0, 2);

                expect(removed).toEqual(['tag1', 'tag2']);
                expect(storage.state.tags).toEqual(['tag3']);
            });

            it('should splice from nested array', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('levels')
                    .at(0)
                    .prop('enemies');
                const removed = path.splice(0, 1);

                expect(storage.operations).toContainEqual({
                    method: 'splice',
                    path: 'levels.0.enemies',
                    args: [0, 1]
                });
                expect(removed).toEqual([{ health: 100, type: 'goblin' }]);
                expect(storage.state.levels[0].enemies).toHaveLength(1);
            });

            it('should splice without deleteCount', () => {
                const path = new StatePath<TestState, TestState>(storage)
                    .prop('items');
                const removed = path.splice(1);

                expect(removed).toEqual([
                    { id: 2, name: 'Item 2' },
                    { id: 3, name: 'Item 3' }
                ]);
                expect(storage.state.items).toHaveLength(1);
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty path (root access)', () => {
            const path = new StatePath<TestState, TestState>(storage);
            const state = path.get();

            expect(state).toBe(storage.state);
            expect(storage.operations).toContainEqual({
                method: 'get',
                path: ''
            });
        });

        it('should handle deep nesting (3+ levels)', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('levels')
                .at(0)
                .prop('enemies')
                .at(1)
                .prop('type');
            expect(path.path).toBe('levels.0.enemies.1.type');
            expect(path.get()).toBe('orc');
        });

        it('should handle array at root level when state is array', () => {
            const arrayStorage = new MockStateStorage(['a', 'b', 'c']);
            const path = new StatePath<string[], string[]>(arrayStorage);
            expect(path.get()).toEqual(['a', 'b', 'c']);
        });

        it('should handle array of arrays access', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('matrix')
                .at(0);
            expect(path.get()).toEqual([1, 2]);

            const deepPath = new StatePath<TestState, TestState>(storage)
                .prop('matrix')
                .at(1)
                .at(1);
            expect(deepPath.get()).toBe(4);
        });

        it('should handle zero index correctly', () => {
            const path = new StatePath<TestState, TestState>(storage)
                .prop('items')
                .at(0);
            expect(path.path).toBe('items.0');
            expect(path.get()).toEqual({ id: 1, name: 'Item 1' });
        });

        it('should handle negative-like edge cases', () => {
            // While TypeScript would prevent negative indices, test path building
            const path = new StatePath<TestState, any>(storage)
                .prop('items')
                .at(-1);
            expect(path.path).toBe('items.-1');
        });
    });

    describe('Immutability', () => {
        it('should not mutate existing path when chaining', () => {
            const basePath = new StatePath<TestState, TestState>(storage)
                .prop('user');
            const profilePath = basePath.prop('profile');
            const namePath = profilePath.prop('name');

            expect(basePath.path).toBe('user');
            expect(profilePath.path).toBe('user.profile');
            expect(namePath.path).toBe('user.profile.name');
        });

        it('should create independent paths from same base', () => {
            const basePath = new StatePath<TestState, TestState>(storage)
                .prop('user')
                .prop('profile');

            const namePath = basePath.prop('name');
            const agePath = basePath.prop('age');

            expect(namePath.path).toBe('user.profile.name');
            expect(agePath.path).toBe('user.profile.age');
            expect(basePath.path).toBe('user.profile');
        });
    });
});
