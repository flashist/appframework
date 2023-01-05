import { BaseAppMediator } from "../../base/mediators/BaseAppMediator";
import { appStateChangeEvent } from "../../state/AppStateModule";
import { PagesModuleStateType } from "../data/state/PagesModuleStateType";
import { PagesView } from "./PagesView";

export class PagesMediator extends BaseAppMediator<PagesView> {

    onActivatorStart(activator: PagesView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<PagesModuleStateType>()("pagesModule.pageId"),
            this.onPageIdChange
        );
    }

    protected onPageIdChange(): void {
        this.activator.commitPagesData();
    }
}