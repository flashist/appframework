/**
 * Shared utilities for depth-limited recursive types.
 *
 * The Prev tuple is used to decrement depth counters in recursive type definitions.
 * When D is used as an index into Prev, it returns D-1 (e.g., Prev[5] = 4).
 * When D reaches 0, Prev[0] = never, which triggers the base case.
 */
export type Prev = [
    never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]
];

/**
 * Default depth for Flatten type.
 *
 * Flatten generates exponential string unions for deep key paths.
 * A depth of 5 covers paths like `a.b.c.d.e` which is sufficient
 * for most state trees while avoiding excessive type computation.
 */
export type DefaultFlattenDepth = 5;

/**
 * Default depth for DeepReadonly and DeepPartial types.
 *
 * These types have simpler recursion than Flatten (no string unions),
 * so they can safely recurse deeper. A depth of 10 handles most
 * real-world nested state structures.
 */
export type DefaultDeepTypeDepth = 10;
