import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { appStorage } from "../../state/AppStateModule";
import { PagesModuleState } from "../data/state/PagesModuleState";

export class ChangePageCommand extends BaseAppCommand {

    // protected pagesModel: PagesModel = getInstance(PagesModel);

    constructor(protected pageId: string) {
        super();
    }

    protected executeInternal(): void {
        appStorage().change<PagesModuleState>()("pages.pageId", this.pageId);

        this.notifyComplete();
    }
}