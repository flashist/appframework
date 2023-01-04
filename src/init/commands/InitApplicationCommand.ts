import { QueueCommand } from "@flashist/fcore";

import { getInstance, WaitGroupLoadingCompleteCommand } from "@flashist/flibs";

import { LoadAppConfigCommand } from "../../app/commands/LoadAppConfigCommand";
import { LoadGroupName } from "../../load/LoadGroupName";
import { ChangePageCommand } from "../../pages/commands/ChangePageCommand";
import { InitApplicationDataCommand } from "./InitApplicationDataCommand";
import { ParseStaticItemsConfigCommand } from "../../app/commands/ParseStaticItemsConfigCommand";
import { ParseLocaleConfigCommand } from "../../locales/commands/ParseLocaleConfigCommand";
import { ParseAssetsConfigCommand } from "../../assets/commands/ParseAssetsConfigCommand";
import { DispatchGlobalEventCommand } from "../../events/commands/DispatchGlobalEventCommand";
import { InitApplicationEvent } from "../events/InitApplicationEvent";
import { PreloaderPageId } from "../../preloader-page/data/PreloaderPageId";

export class InitApplicationCommand extends QueueCommand {

    constructor() {
        super(
            [
                getInstance(LoadAppConfigCommand),
                getInstance(WaitGroupLoadingCompleteCommand, LoadGroupName.CONFIG),

                getInstance(ParseLocaleConfigCommand),
                getInstance(ParseAssetsConfigCommand),
                getInstance(ParseStaticItemsConfigCommand),

                getInstance(WaitGroupLoadingCompleteCommand, LoadGroupName.PRELOAD),
                getInstance(DispatchGlobalEventCommand, InitApplicationEvent.READY_TO_INIT_VIEW),

                getInstance(InitApplicationDataCommand),

                getInstance(ChangePageCommand, PreloaderPageId)
            ]
        );
    }
}