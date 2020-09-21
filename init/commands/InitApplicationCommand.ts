import {
    QueueCommand
} from "@flashist/fcore";

import {
    getInstance,
    WaitGroupLoadingCompleteCommand
} from "@flashist/flibs";

import {LoadAppConfigCommand} from "../../../appframework/app/commands/LoadAppConfigCommand";
import {LoadGroupName} from "../../../appframework/load/LoadGroupName";
import {ChangePageCommand} from "../../../appframework/pages/commands/ChangePageCommand";
import {PageId} from "../../../appframework/pages/PageId";
import {InitApplicationDataCommand} from "./InitApplicationDataCommand";
import {ParseStaticItemsConfigCommand} from "../../app/commands/ParseStaticItemsConfigCommand";
import {ParseLocaleConfigCommand} from "../../locales/commands/ParseLocaleConfigCommand";
import {ParseAssetsConfigCommand} from "../../assets/commands/ParseAssetsConfigCommand";

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

                getInstance(InitApplicationDataCommand),

                getInstance(ChangePageCommand, PageId.PRELOADER_PAGE)
            ]
        );
    }
}