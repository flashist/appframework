import {
    Command
} from "@flashist/fcore";

/**
 * Command-placeholder for specific applications init their data (e.g. first server request)
 */
export class InitApplicationDataCommand extends Command {

    protected executeInternal(): void {
        this.notifyComplete();
    }

}