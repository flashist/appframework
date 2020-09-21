import {
    IConstructor
} from "@flashist/fcore";

import {
    DisplayObjectContainer,
    getInstance
} from "@flashist/flibs";

import {ViewLazyCreationStack} from "./ViewLazyCreationStack";

export class ViewLazyCreationServiceLocatorStack<StackViewType extends DisplayObjectContainer = DisplayObjectContainer> extends ViewLazyCreationStack<StackViewType> {

    protected getNewInstance(id: string): StackViewType {
        let result: StackViewType;

        let TempClass: IConstructor<any> = (this.viewClassToIdMap.getItem(id) as IConstructor<any>);
        if (TempClass) {
            result = getInstance(TempClass);
        }

        return result;
    }
}