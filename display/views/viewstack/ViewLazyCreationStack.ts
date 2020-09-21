import {
    IConstructor,
    AssociativeArray
} from "@flashist/fcore";

import {
    DisplayObjectContainer
} from "@flashist/flibs";

import {ViewStack} from "./ViewStack";

export class ViewLazyCreationStack<StackViewType extends DisplayObjectContainer = DisplayObjectContainer> extends ViewStack<StackViewType> {

    protected viewClassToIdMap: AssociativeArray<IConstructor<StackViewType>>;

    construction(...args): void {
        super.construction(...args);

        this.viewClassToIdMap = new AssociativeArray<IConstructor<StackViewType>>();
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
            this.addView(
                this.getNewInstance(id),
                id
            );
        }

        return super.getViewById(id);
    }

    protected getNewInstance(id: string): StackViewType {
        let result: StackViewType;

        let TempClass: IConstructor<any> = (this.viewClassToIdMap.getItem(id) as IConstructor<any>);
        if (TempClass) {
            result = new TempClass();
        }

        return result;
    }
}