import {BaseAppCommand} from "../../base/commands/BaseAppCommand";

export class WaitGlobalEventCommand extends BaseAppCommand {

    constructor(protected event: string, guard?: () => boolean) {
        super();

        if (guard) {
            this.guard = guard;
        }
    }

    protected executeInternal(): void {
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            this.event,
            () => {
                if (!this.guard || this.guard()) {
                    this.notifyComplete();
                }
            }
        );
    }

}3