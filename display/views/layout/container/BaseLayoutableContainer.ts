import {
    FContainer
} from "@flashist/flibs";

import {ILayoutableContainer} from "./ILayoutableContainer";
import {ILayoutableChild} from "./ILayoutableChild";

export class BaseLayoutableContainer<ChildType extends ILayoutableChild = ILayoutableChild>
    extends FContainer
    implements ILayoutableContainer<ChildType> {

    public children: ChildType[];

    layoutGetChildrenNum(): number {
        return this.children.length;
    }

    layoutGetChildAt(index: number): ChildType {
        return this.children[index];
    }

}
	