import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {InitApplicationDataEvent} from "./InitApplicationDataEvent";

/**
 * Command-placeholder for specific applications init their data (e.g. first server request)
 */
export class InitApplicationDataCommand extends BaseAppCommand {

    protected executeInternal(): void {
        this.notifyComplete();
    }


    protected notifyComplete(resolveData?: any, rejectErrorData?: any): void {
        this.dispatchEvent(InitApplicationDataEvent.INTI_APPLICATION_DATA_COMPLETE);

        super.notifyComplete(resolveData, rejectErrorData);
    }
}