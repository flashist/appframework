// import type {BuiltIns, HasMultipleCallSignatures} from './internal';
export type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
    T extends { (...arguments_: infer A): unknown; (...arguments_: any[]): unknown }
    ? unknown[] extends A
    ? false
    : true
    : false;

export type Primitive =
    | null
    | undefined
    | string
    | number
    | boolean
    | symbol
    | bigint;

export type BuiltIns = Primitive | Date | RegExp;

/**
Convert `object`s, `Map`s, `Set`s, and `Array`s and all of their keys/elements into immutable structures recursively.

This is useful when a deeply nested structure needs to be exposed as completely immutable, for example, an imported JSON module or when receiving an API response that is passed around.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/13923) if you want to have this type as a built-in in TypeScript.

@example
```
// data.json
{
    "foo": ["bar"]
}

// main.ts
import type {DeepReadonly} from 'type-fest';
import dataJson = require('./data.json');

const data: DeepReadonly<typeof dataJson> = dataJson;

export default data;

// test.ts
import data from './main';

data.foo.push('bar');
//=> error TS2339: Property 'push' does not exist on type 'readonly string[]'
```

Note that types containing overloaded functions are not made deeply readonly due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Object
@category Array
@category Set
@category Map
*/
// export type DeepReadonly<T> = T extends BuiltIns
export type DeepReadonly<T> = T extends BuiltIns
    ? T
    : T extends (...arguments_: any[]) => unknown
    ? {} extends DeepReadonlyObject<T>
    ? T
    : HasMultipleCallSignatures<T> extends true
    ? T
    : ((...arguments_: Parameters<T>) => ReturnType<T>) & DeepReadonlyObject<T>
    : T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
    ? DeepReadonlyMap<KeyType, ValueType>
    : T extends Readonly<ReadonlySet<infer ItemType>>
    ? DeepReadonlySet<ItemType>
    : // Identify tuples to avoid converting them to arrays inadvertently; special case `readonly [...never[]]`, as it emerges undesirably from recursive invocations of DeepReadonly below.
    T extends readonly [] | readonly [...never[]]
    ? readonly []
    : T extends readonly [infer U, ...infer V]
    ? readonly [DeepReadonly<U>, ...DeepReadonly<V>]
    : T extends readonly [...infer U, infer V]
    ? readonly [...DeepReadonly<U>, DeepReadonly<V>]
    : T extends ReadonlyArray<infer ItemType>
    ? ReadonlyArray<DeepReadonly<ItemType>>
    : T extends object
    ? DeepReadonlyObject<T>
    : unknown;

/**
Same as `DeepReadonly`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `DeepReadonly`.
*/
type DeepReadonlyMap<KeyType, ValueType> = {} & Readonly<ReadonlyMap<DeepReadonly<KeyType>, DeepReadonly<ValueType>>>;

/**
Same as `DeepReadonly`, but accepts only `ReadonlySet`s as inputs. Internal helper for `DeepReadonly`.
*/
type DeepReadonlySet<ItemType> = {} & Readonly<ReadonlySet<DeepReadonly<ItemType>>>;

/**
Same as `DeepReadonly`, but accepts only `object`s as inputs. Internal helper for `DeepReadonly`.
*/
type DeepReadonlyObject<ObjectType extends object> = {
    readonly [KeyType in keyof ObjectType]: DeepReadonly<ObjectType[KeyType]>
};