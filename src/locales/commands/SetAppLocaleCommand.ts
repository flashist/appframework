import { getInstance, LocaleManager } from "@flashist/flibs";

import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { DeviceModuleState } from "../../device";
import { appStorage } from "../../state/AppStateModule";

export class SetAppLocaleCommand extends BaseAppCommand {

    protected executeInternal(): void {
        const deviceState = appStorage().getState<DeviceModuleState>();
        let localeManager: LocaleManager = getInstance<LocaleManager>(LocaleManager);
        localeManager.setCurrentLocaleId(deviceState.device.mainLocale);

        this.notifyComplete();
    }
}