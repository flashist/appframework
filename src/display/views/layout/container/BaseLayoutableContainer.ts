import { DisplayObjectContainer, FContainer } from "@flashist/flibs";

import { ILayoutableContainer } from "./ILayoutableContainer";
import { ILayoutableChild } from "./ILayoutableChild";

export class BaseLayoutableContainer<ChildType extends ILayoutableChild = ILayoutableChild, DataType extends any = any>
    extends FContainer<DataType>
    implements ILayoutableContainer<ChildType> {

    // public layoutableChildren: ChildType[];

    constructor(...args: any[]) {
        super(...args);

        // this.layoutableChildren = this.children as DisplayObjectContainer[];
    }

    layoutGetChildrenNum(): number {
        return this.children.length;
    }

    layoutGetChildAt(index: number): ChildType {
        return this.children[index] as ChildType;
    }

}
