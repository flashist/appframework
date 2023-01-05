type Writable<T, O> = T extends O ? T : {
    [P in keyof T as IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>]: T[P]
}

type IfEquals<X, Y, A = X, B = never> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

type Cleanup<T> =
    0 extends (1 & T) ? unknown :
    T extends readonly any[] ?
    (Exclude<keyof T, keyof any[]> extends never ?
        { [k: `${number}`]: T[number] } : Omit<T, keyof any[]>) : T;

type PrefixKeys<V, K extends PropertyKey, O> =
    V extends O ? { [P in K]: V } : V extends object ?
    { [P in keyof V as
        `${Extract<K, string | number>}.${Extract<P, string | number>}`]: V[P] } :
    { [P in K]: V };

type ValueOf<T> = T[keyof T];

export type Flatten<T, O = never> = Writable<Cleanup<T>, O> extends infer U ?
    U extends O ? U : U extends object ?
    ValueOf<{ [K in keyof U]-?: (x: PrefixKeys<Flatten<U[K], O>, K, O>) => void }>
    | ((x: U) => void) extends (x: infer I) => void ?
    { [K in keyof I]: I[K] } : never : U : never;

// function lookup<T, K extends keyof Flatten<T>>(obj: T, key: K): Flatten<T>[K];
// function lookup(obj: any, key: string) {
//     const i = key.indexOf(".");
//     return (i < 0) ? obj[key] : (lookup as any)(obj[key.substring(0, i)], key.substring(i + 1));
// }


/*
// TRY #2: EXAMPLES OF USING 

// function shortLookup<ObjectType, DeepKeyType extends keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType]>(obj: ObjectType, key: DeepKeyType, value: ValueType): void {
function shortLookup<ObjectType, DeepKeyType extends keyof Flatten<ObjectType>>(obj: ObjectType = {} as any, key: DeepKeyType, value: Flatten<ObjectType>[DeepKeyType]): void {
    // const i = key.indexOf(".");
    // return (i < 0) ? obj[key] : (lookup as any)(obj[key.substring(0, i)], key.substring(i + 1));
}

function myLookup<ObjectType, DeepKeyType extends keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType]>(obj: ObjectType, deepKey: DeepKeyType, value: ValueType): void;
function myLookup(obj: any, deepKey: string, value: any) {
}

function myLookupOneInstance<ObjectType, DeepKeyType extends keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType]>(obj: ObjectType, deepKey: DeepKeyType, value: ValueType): void {
}

// function myLookup2<ObjectType, DeepKeyType extends keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType]>(deepKey: DeepKeyType, value: ValueType, obj: ObjectType): void;
function myLookup2<ObjectType, DeepKeyType extends keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType]>(deepKey: DeepKeyType, value: ValueType, obj: ObjectType = {} as ObjectType) {
}

// function myLookupWithoutObj<ObjectType extends object, DeepKeyType extends keyof Flatten<ObjectType> = keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType] = Flatten<ObjectType>[DeepKeyType]>(deepKey: DeepKeyType, value: ValueType): void;
function myLookupWithoutObj<ObjectType extends object, DeepKeyType extends keyof Flatten<ObjectType> = keyof Flatten<ObjectType>, ValueType extends Flatten<ObjectType>[DeepKeyType] = Flatten<ObjectType>[DeepKeyType]>(deepKey: DeepKeyType, value: ValueType) {
}

// type FooType = {
//     a: [number, { b: string }, number]
//     c: {
//         d: {
//             e: number
//         }
//     }
// }
const foo = {
    a: [1, { b: "two" }, 3] as [number, { b: string }, number],
    c: { d: { e: 1 } }
}
type FooType = typeof foo;

lookup(foo, "a.1.b").toUpperCase() // TWO
myLookup(foo, "a.1.b", 20).toUpperCase() // TWO
myLookup(foo, "a.0", 20);
myLookup(foo, "a.0", "20");

myLookupOneInstance(foo, "c", 20);
myLookupOneInstance(null as FooType, "a.0", 20);

shortLookup({} as FooType, "a.0", "20");
shortLookup({} as FooType, "a.0", 20);

myLookup2("a.0", "2", foo);
myLookup2<FooType, keyof Flatten<FooType>, Flatten<FooType>[keyof Flatten<FooType>]>("a.0", "20");
myLookup2("a.0", 20);
myLookup2<FooType>(foo, "a", "20");
myLookup2<FooType>(foo, "a.0", 20);
myLookupWithoutObj<FooType>("c.e", 20);
myLookupWithoutObj<FooType, keyof Flatten<FooType>, Flatten<FooType>[keyof Flatten<FooType>]>("a.0", 20);
myLookupWithoutObj<FooType, keyof Flatten<FooType>, Flatten<FooType>[keyof Flatten<FooType>]>("a.0", "20");
myLookupWithoutObj<FooType>("a.0", "20");
myLookupWithoutObj<FooType>("a.1", "20");

*/


// function lookupWithReturn<ValueType>(obj: any, key: string, value: ValueType): typeof value {
//     const i = key.indexOf(".");
//     return (i < 0) ? obj[key] : (lookup as any)(obj[key.substring(0, i)], key.substring(i + 1));
// }
// lookupWithReturn(foo, "a.0", 20)
// lookupWithReturn(foo, "a.0", "20")
// // lookupWithReturn(foo, "a.0", false)

// try {
//     console.log(lookup(foo, "c.d.e")) // oops, error, can't necessarily look that up
// } catch (e) {
//     console.log(e); // maybe obj is undefined
// }

/*
==== FIRST DRAFT: works, but not perfect, cuz gets list of split properties and can't get a.0 as an index for array elements ====

type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;


type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T] : ""

type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";


// type NestedObjectType = {
//     a: string;
//     b: string;
//     nest: {
//         c: string;
//     };
//     otherNest: {
//         otherNest: {
//             c: string;
//         }
//     };
// };

interface Tree {
    left: Tree,
    right: Tree,
    data: string
}

// type TreeLeaves = Leaves<Tree>; // sorry, compiler 💻⌛😫
// type TreeLeaves = "data" | "left.data" | "right.data" | "left.left.data" |
// "left.right.data" | "right.left.data" | "right.right.data" | "left.left.left.data" | 
// "left.left.right.data" | "left.right.left.data" | ... 1012 more ... | 
// "right.right.right.right.right.right.right.right.right.data"

type TreeLeaves = Leaves<Tree, 100>;
// type TreeLeaves =  "data" | "left.data" | "right.data" | "left.left.data" | 
// "left.right.data" | "right.left.data" | "right.right.data"

// type NestedObjectPaths = Paths<NestedObjectType>;
// type NestedObjectPaths = "a" | "b" | "nest" | "otherNest" | "nest.c" | "otherNest.c"
// type NestedObjectLeaves = Leaves<NestedObjectType>
// type NestedObjectLeaves = "a" | "b" | "nest.c" | "otherNest.c"

export type ObjectSingleNestedPathType<T extends object> = Paths<T>;
export type ObjectNestedPathsType<T extends object> = Array<Paths<T>>

// const test: MyGenericType<NestedObjectType> = {
//     keys: ["a", "nest.c", "otherNest.otherNest"]
// }

*/