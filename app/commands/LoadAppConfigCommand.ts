import {CommandErrorCode} from "@flashist/fcore";
import {
    LoadItemCommand,
    getInstance,
    LoadItemsListCommand,
    LoadManager
} from "@flashist/flibs";

import {IAppConfigVO} from "../data/IAppConfigVO";
import {AppConfigModel} from "../models/AppConfigModel";
import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
export class LoadAppConfigCommand extends BaseAppCommand {

    protected executeInternal(): void {
        const appConfigModel: AppConfigModel = getInstance(AppConfigModel);
        new LoadItemCommand(
            {
                src: appConfigModel.appConfig.appConfigFilePath,
                id: appConfigModel.appConfig.appConfigFilePath
            }
        )
            .execute()
            .then(
                (data: IAppConfigVO) => {
                    console.log("LoadAppConfigCommand | executeInternal __ data: ", data);

                    //
                    appConfigModel.changeConfig(data);

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