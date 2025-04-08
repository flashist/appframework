import { BaseAppMediator } from "../../base/mediators/BaseAppMediator";
import { appStateStorageChangeEvent } from "../../state/AppStateModule";
import { PagesModuleState } from "../data/state/PagesModuleState";
import { PagesView } from "./PagesView";

export class PagesMediator extends BaseAppMediator<PagesView> {

    onActivatorStart(activator: PagesView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateStorageChangeEvent<PagesModuleState>()("pages.pageId"),
            this.onPageIdChange
        );
    }

    protected onPageIdChange(): void {
        this.activator.commitPagesData();
    }
}