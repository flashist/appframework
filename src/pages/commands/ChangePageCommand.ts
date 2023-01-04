import { BaseAppCommand } from "../../base/commands/BaseAppCommand";
import { appStorage } from "../../state/AppStateModule";
import { PagesModuleStateType } from "../data/state/PagesModuleStateType";

export class ChangePageCommand extends BaseAppCommand {

    // protected pagesModel: PagesModel = getInstance(PagesModel);

    constructor(protected pageId: string) {
        super();
    }

    protected executeInternal(): void {
        appStorage().change<PagesModuleStateType>()("pagesModule.pageId", this.pageId);

        this.notifyComplete();
    }
}