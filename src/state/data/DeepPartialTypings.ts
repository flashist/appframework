import { BuiltIns } from "./DeepReadableTypings";
import { DefaultDeepTypeDepth, Prev } from "./DeepTypeUtils";


/**
@see DeepPartial
*/
export type DeepPartialOptions = {
    /**
    Whether to affect the individual elements of arrays and tuples.

    @default false
    */
    readonly recurseIntoArrays?: boolean;
};

/**
Create a type from another type with all keys and nested keys set to optional.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@typeParam T - The type to make deeply partial
@typeParam Options - Configuration options for the transformation
@typeParam D - Maximum recursion depth (default: 10)

@example
```
import type {DeepPartial} from 'type-fest';

const settings: Settings = {
    textEditor: {
        fontSize: 14;
        fontColor: '#000000';
        fontWeight: 400;
    }
    autocomplete: false;
    autosave: true;
};

const applySavedSettings = (savedSettings: DeepPartial<Settings>) => {
    return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```

By default, this does not affect elements in array and tuple types. You can change this by passing `{recurseIntoArrays: true}` as the second type argument:

```
import type {DeepPartial} from 'type-fest';

interface Settings {
    languages: string[];
}

const partialSettings: DeepPartial<Settings, {recurseIntoArrays: true}> = {
    languages: [undefined]
};
```

@category Object
@category Array
@category Set
@category Map
*/
export type DeepPartial<T, Options extends DeepPartialOptions = {}, D extends number = DefaultDeepTypeDepth> =
    [D] extends [never]
    ? Partial<T>  // At max depth, apply shallow partial
    : T extends BuiltIns
    ? T
    : T extends Map<infer KeyType, infer ValueType>
    ? DeepPartialMap<KeyType, ValueType, Options, D>
    : T extends Set<infer ItemType>
    ? DeepPartialSet<ItemType, Options, D>
    : T extends ReadonlyMap<infer KeyType, infer ValueType>
    ? DeepPartialReadonlyMap<KeyType, ValueType, Options, D>
    : T extends ReadonlySet<infer ItemType>
    ? DeepPartialReadonlySet<ItemType, Options, D>
    : T extends ((...arguments_: any[]) => unknown)
    ? T | undefined
    : T extends object
    ? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
    ? Options['recurseIntoArrays'] extends true
    ? ItemType[] extends T // Test for arrays (non-tuples) specifically
    ? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
    ? ReadonlyArray<DeepPartial<ItemType | undefined, Options, Prev[D]>>
    : Array<DeepPartial<ItemType | undefined, Options, Prev[D]>>
    : DeepPartialObject<T, Options, D> // Tuples behave properly
    : T // If they don't opt into array testing, just use the original type
    : DeepPartialObject<T, Options, D>
    : unknown;

/**
Same as `DeepPartial`, but accepts only `Map`s and as inputs. Internal helper for `DeepPartial`.
*/
type DeepPartialMap<KeyType, ValueType, Options extends DeepPartialOptions, D extends number> = {} & Map<DeepPartial<KeyType, Options, Prev[D]>, DeepPartial<ValueType, Options, Prev[D]>>;

/**
Same as `DeepPartial`, but accepts only `Set`s as inputs. Internal helper for `DeepPartial`.
*/
type DeepPartialSet<T, Options extends DeepPartialOptions, D extends number> = {} & Set<DeepPartial<T, Options, Prev[D]>>;

/**
Same as `DeepPartial`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `DeepPartial`.
*/
type DeepPartialReadonlyMap<KeyType, ValueType, Options extends DeepPartialOptions, D extends number> = {} & ReadonlyMap<DeepPartial<KeyType, Options, Prev[D]>, DeepPartial<ValueType, Options, Prev[D]>>;

/**
Same as `DeepPartial`, but accepts only `ReadonlySet`s as inputs. Internal helper for `DeepPartial`.
*/
type DeepPartialReadonlySet<T, Options extends DeepPartialOptions, D extends number> = {} & ReadonlySet<DeepPartial<T, Options, Prev[D]>>;

/**
Same as `DeepPartial`, but accepts only `object`s as inputs. Internal helper for `DeepPartial`.
*/
type DeepPartialObject<ObjectType extends object, Options extends DeepPartialOptions, D extends number> = {
    [KeyType in keyof ObjectType]?: DeepPartial<ObjectType[KeyType], Options, Prev[D]>
};
