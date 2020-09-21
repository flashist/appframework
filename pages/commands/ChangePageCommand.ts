import {getInstance} from "@flashist/flibs";

import {PagesModel} from "../models/PagesModel";
import {BaseAppCommand} from "../../base/commands/BaseAppCommand";

export class ChangePageCommand extends BaseAppCommand {

    protected pagesModel: PagesModel = getInstance(PagesModel);

    constructor(protected pageId: string) {
        super();
    }

    protected executeInternal(): void {
        this.pagesModel.pageId = this.pageId;
        this.notifyComplete();
    }
}