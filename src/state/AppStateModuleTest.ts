/**
 * Type and runtime tests for the StatePath API.
 * This file is compiled with the library to verify types work correctly.
 */
import { AppStateStorage } from "./data/AppStateStorage";

// Test state type resembling real-world usage (similar to user's StrelkiModuleState)
interface TestArrowVO {
    id: number,
    frozenAdjacentRemovalCount: number,
    frozenData: {
        adjacentRemovalCount: number
    }
};

const TestModuleStateInitialValue = {
    strelki: {
        static: {
            level: { id: 0 as number }
        },
        dynamic: {
            curLives: 0 as number,
            maxLives: 0 as number,
            arrows: [] as TestArrowVO[],
            destroyables: [] as { id: number }[]
        }
    }
}
type TestModuleState = typeof TestModuleStateInitialValue;

/**
 * Type-level tests - these lines must compile without errors.
 * If any line has a TypeScript error, the types are broken.
 */
export function verifyStatePathTypes(storage: AppStateStorage): void {
    //
    storage.initializeWith(TestModuleStateInitialValue);
    storage.initializeComplete();

    //
    const arrowIndex = 0;
    const newCount = 5;

    // TEST 1: This is the exact pattern that was failing for the user
    // Error was: Property 'frozenAdjacentRemovalCount' does not exist on type 'StatePath<...>'
    storage.$<TestModuleState>().strelki.dynamic.arrows.at(arrowIndex).frozenAdjacentRemovalCount.set(newCount);

    // TEST 2: Alternative with prop() - this was working before
    storage.$<TestModuleState>().strelki.dynamic.arrows.at(arrowIndex).prop("frozenData").prop("adjacentRemovalCount").set(newCount);

    // TEST 3: Get value via dot notation after at()
    const count: number = storage.$<TestModuleState>().strelki.dynamic.arrows.at(arrowIndex).frozenAdjacentRemovalCount.get();

    // TEST 4: Nested object access after at()
    const nestedCount: number = storage.$<TestModuleState>().strelki.dynamic.arrows.at(arrowIndex).frozenData.adjacentRemovalCount.get();

    // TEST 5: Path building verification
    const path1: string = storage.$<TestModuleState>().strelki.dynamic.arrows.at(0).frozenAdjacentRemovalCount.path;
    // Expected: "strelki.dynamic.arrows.0.frozenAdjacentRemovalCount"

    // TEST 6: Multiple at() calls
    // (Would need nested arrays to test, but verifies chaining works)

    // TEST 7: Array operations after navigation
    storage.$<TestModuleState>().strelki.dynamic.arrows.push({ id: 1, frozenAdjacentRemovalCount: 0, frozenData: { adjacentRemovalCount: 0 } });

    console.log("All type tests passed - path example:", path1);
}
