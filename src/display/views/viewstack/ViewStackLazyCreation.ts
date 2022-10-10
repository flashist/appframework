import {AssociativeArray, IConstructor} from "@flashist/fcore";

import {DisplayObject, DisplayObjectContainer} from "@flashist/flibs";

import {ViewStack} from "./ViewStack";

export class ViewStackLazyCreation
    <
        StackViewType extends DisplayObjectContainer = DisplayObjectContainer,
        DataType extends object = object
    >
    extends ViewStack<StackViewType, DataType> {

    protected viewClassToIdMap: AssociativeArray<IConstructor<DisplayObject>>;

    construction(...args: any[]): void {
        super.construction(...args);

        this.viewClassToIdMap = new AssociativeArray<IConstructor<DisplayObject>>();
    }

    public addViewClass(ViewClass: IConstructor<StackViewType>, id: string): void {
        this.viewClassToIdMap.push(ViewClass, id);
    }

    public removeViewClass(ViewClass: IConstructor<StackViewType>): void {
        this.viewClassToIdMap.remove(ViewClass);
    }

    public getViewById(id: string): StackViewType {
        // Check if the needed view exists, if not, then create it
        if (!super.getViewById(id)) {
            let TempClass: IConstructor<any> = (this.viewClassToIdMap.getItem(id) as IConstructor<any>);
            if (TempClass) {
                this.addView(
                    new TempClass(),
                    id
                );
            }
        }

        return super.getViewById(id);
    }

}