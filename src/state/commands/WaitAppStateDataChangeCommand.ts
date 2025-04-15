import { BaseAppCommand } from "../../../index";
import { appStateStorageChangeEvent, appStateStorage } from "../AppStateModule";

export class WaitAppStateDataChageCommand extends BaseAppCommand {
    constructor(protected deepKey: string, protected value: any) {
        super();
    }

    guard(): boolean {
        let result: boolean = super.guard();
        if (result) {
            if (this.value == this.getAppStateValue()) {
                result = false;
            }
        }

        return result;
    }

    protected getAppStateValue(): any {
        return (appStateStorage().getValue<any>() as any)(this.deepKey);
    }

    protected executeInternal(): void {
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            (appStateStorageChangeEvent() as any)(this.deepKey),
            () => {
                if (this.value == this.getAppStateValue()) {
                    this.notifyComplete();
                }
            }
        )
    }
}