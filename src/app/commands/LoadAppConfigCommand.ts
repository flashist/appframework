import {CommandErrorCode} from "@flashist/fcore";
import {
    GenericObjectsByTypeModel,
    getInstance,
    LoadItemCommand,
    LoadItemsListCommand,
    LoadManager
} from "@flashist/flibs";

import {AppConfigModel} from "../models/AppConfigModel";
import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {AppSettings} from "../AppSettings";
import {AppConfigVO} from "../data/AppConfigVO";

export class LoadAppConfigCommand extends BaseAppCommand {
    BasePageView
    protected executeInternal(): void {
        const appConfigModel: AppConfigModel = getInstance(AppConfigModel);
        new LoadItemCommand(
            {
                src: AppSettings.appConfigPath,
                id: AppSettings.appConfigPath
            }
        )
            .execute()
            .then(
                (data: AppConfigVO) => {
                    console.log("LoadAppConfigCommand | executeInternal __ data: ", data);

                    //
                    const genericObjectsByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
                    genericObjectsByTypeModel.commitItems([data]);

                    //
                    const loadManager: LoadManager = getInstance(LoadManager);
                    loadManager.addSubstituteParams(
                        {
                            locale: appConfigModel.appConfig.locale
                        }
                    );

                    //
                    if (data.files) {
                        new LoadItemsListCommand(appConfigModel.appConfig.files)
                            .execute();
                    }

                    this.notifyComplete();
                },
                () => {
                    const errorText: string = "LoadAppConfigCommand | executeInternal __ ERROR! Can't load the app-config.json file!";
                    console.error(errorText);
                    alert(errorText);

                    this.errorCode = CommandErrorCode.GENERAL_ERROR;
                    this.terminate();
                }
            );
    }

}