import {BaseAppCommand} from "../../base/commands/BaseAppCommand";

export class WaitGlobalEventCommand extends BaseAppCommand {

    constructor(protected event: string, protected guard?: () => boolean) {
        super();
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

}