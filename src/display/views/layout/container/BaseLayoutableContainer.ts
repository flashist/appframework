import { FContainer } from "@flashist/flibs";

import { ILayoutableContainer } from "./ILayoutableContainer";
import { ILayoutableChild } from "./ILayoutableChild";

export class BaseLayoutableContainer<ChildType extends ILayoutableChild = ILayoutableChild, DataType extends any = any>
    extends FContainer<DataType>
    implements ILayoutableContainer<ChildType> {

    public layoutableChildren: ChildType[];

    layoutGetChildrenNum(): number {
        return this.layoutableChildren.length;
    }

    layoutGetChildAt(index: number): ChildType {
        return this.layoutableChildren[index];
    }

}
