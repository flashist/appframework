import { AbstractLoadItem, getInstance, ILocaleConfig, LoadManager, LocaleManager } from "@flashist/flibs";

import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { AppSettings } from "../../app/AppSettings";
import { appStorage } from "../../state/AppStateModule";
import { AppModuleState } from "../../app/data/state/AppModuleState";

export class ParseLocaleConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {
        let loadManager: LoadManager = getInstance(LoadManager);
        let localeConfigFileItem: AbstractLoadItem = loadManager.getLoadItem(AppSettings.localeConfigFileId);
        if (localeConfigFileItem && localeConfigFileItem.data) {
            // let appConfigModel: AppConfigModel = getInstance(AppConfigModel);

            let localizationJson: ILocaleConfig = localeConfigFileItem.data;

            let localeManager: LocaleManager = getInstance<LocaleManager>(LocaleManager);

            const appState = appStorage().getState<AppModuleState>();
            localeManager.setCurrentLanguage(appState.app.config.locale);
            localeManager.addLocale(localizationJson, appState.app.config.locale);

            this.notifyComplete();

        } else {
            console.error("ParseLocalizationCommand | executeInternal __ ERROR! Can't find config file!");
            this.terminate();
        }
    }
}