import { AbstractLoadItem, getInstance, ILocaleConfig, LoadManager, LocaleManager } from "@flashist/flibs";

import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { AppSettings } from "../../app/AppSettings";
import { appStorage } from "../../state/AppStateModule";
import { AppModuleState } from "../../app/data/state/AppModuleState";
import { DeviceModuleState } from "../../device";

export class SetAppLocaleCommand extends BaseAppCommand {

    protected executeInternal(): void {
        const deviceState = appStorage().getState<DeviceModuleState>();
        let localeManager: LocaleManager = getInstance<LocaleManager>(LocaleManager);
        localeManager.setCurrentLocaleId(deviceState.device.mainLocale);
    }
}