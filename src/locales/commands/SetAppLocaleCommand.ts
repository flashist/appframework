import { getInstance, LocaleManager } from "@flashist/flibs";

import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { DeviceModuleState } from "../../index";
import { appStateStorage } from "../../state/AppStateModule";

export class SetAppLocaleCommand extends BaseAppCommand {

    protected executeInternal(): void {
        const deviceState = appStateStorage().getState<DeviceModuleState>();
        let localeManager: LocaleManager = getInstance<LocaleManager>(LocaleManager);
        localeManager.setCurrentLocaleId(deviceState.device.mainLocale);

        this.notifyComplete();
    }
}