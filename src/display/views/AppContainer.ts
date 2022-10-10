import {FContainer} from "@flashist/flibs";
import {EventListenerHelper} from "@flashist/fcore";

export class AppContainer<DataType extends any = any> extends FContainer<DataType> {

    protected dataEventListenerHelper: EventListenerHelper;

    protected construction(...args): void {
        super.construction(...args);

        this.dataEventListenerHelper = new EventListenerHelper(this);
    }

    protected processDataUnset(value: DataType): void {
        super.processDataUnset(value);

        this.dataEventListenerHelper.removeAllListeners();
    }

}