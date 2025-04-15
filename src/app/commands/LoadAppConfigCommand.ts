import { CommandErrorCode } from "@flashist/fcore";
import {
    getInstance,
    LoadItemCommand,
    LoadItemsListCommand,
    LoadManager
} from "@flashist/flibs";

import { DeviceModuleState } from "../../../index";
import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { appStateStorage } from "../../state/AppStateModule";
import { AppSettings } from "../AppSettings";
import { AppModuleState } from "../data/state/AppModuleState";

export class LoadAppConfigCommand extends BaseAppCommand {
    BasePageView
    protected executeInternal(): void {
        // const appConfigModel: AppConfigModel = getInstance(AppConfigModel);
        new LoadItemCommand(
            {
                src: AppSettings.appConfigPath,
                id: AppSettings.appConfigPath
            }
        )
            .execute()
            .then(
                (data: any) => {
                    console.log("LoadAppConfigCommand | executeInternal __ data: ", data);

                    appStateStorage().change<AppModuleState>()(
                        "app.config",
                        data
                    );

                    //
                    const deviceState = appStateStorage().getMutableState<DeviceModuleState>();
                    //
                    const appState = appStateStorage().getState<AppModuleState>();
                    const loadManager: LoadManager = getInstance(LoadManager);
                    loadManager.addSubstituteParams(
                        {
                            locale: deviceState.device.mainLocale
                        }
                    );

                    //
                    if (data.files) {
                        // as any is needed to "avoid" DeepReadonly problem
                        new LoadItemsListCommand(appState.app.config.files as any)
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