import {AbstractLoadItem, getInstance, ILocaleConfig, LoadManager, LocaleManager} from "@flashist/flibs";

import {AppConfigModel} from "../../app/models/AppConfigModel";
import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {AppSettings} from "../../app/AppSettings";

export class ParseLocaleConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {
        let loadManager: LoadManager = getInstance(LoadManager);
        let localeConfigFileItem: AbstractLoadItem = loadManager.getLoadItem(AppSettings.localeConfigFileId);
        if (localeConfigFileItem && localeConfigFileItem.data) {
            let appConfigModel: AppConfigModel = getInstance(AppConfigModel);

            let localizationJson: ILocaleConfig = localeConfigFileItem.data;

            let localeManager: LocaleManager = getInstance<LocaleManager>(LocaleManager);
            localeManager.setCurrentLanguage(appConfigModel.appConfig.locale);
            localeManager.addLocale(localizationJson, appConfigModel.appConfig.locale);

            this.notifyComplete();

        } else {
            console.error("ParseLocalizationCommand | executeInternal __ ERROR! Can't find config file!");
            this.terminate();
        }
    }
}