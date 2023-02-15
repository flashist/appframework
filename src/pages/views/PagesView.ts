import { ResizableContainer } from "../../display/views/resize/ResizableContainer";
import { ViewLazyCreationServiceLocatorStack } from "../../display/views/viewstack/ViewLazyCreationServiceLocatorStack";
import { appStorage } from "../../state/AppStateModule";
import { PagesModuleState } from "../data/state/PagesModuleState";
import {BasePageView} from "./BasePageView";

export class PagesView extends ResizableContainer {

    // protected pagesModel: PagesModel;

    protected viewStack: ViewLazyCreationServiceLocatorStack<BasePageView>;

    protected construction(...args): void {
        super.construction(args);

        // this.pagesModel = getInstance(PagesModel);

        this.viewStack = new ViewLazyCreationServiceLocatorStack<BasePageView>();
        this.addChild(this.viewStack);

        // let pageIdToViewClassMap = this.pagesModel.getPageIdToViewClassMap();
        // let pageIds: string[] = pageIdToViewClassMap.getAllKeys();
        // let pageIdsCount: number = pageIds.length;
        // for (let pageIdIndex: number = 0; pageIdIndex < pageIdsCount; pageIdIndex++) {
        //     let tempPageClass = pageIdToViewClassMap.getItemByIndex(pageIdIndex);
        //     let tempPageId: string = pageIds[pageIdIndex];

        //     this.viewStack.addViewClass(tempPageClass, tempPageId);
        // }

        // const pagesModuleState: IPagesModuleAppState = reduxGetTypedState<GlobalStoreWithPagesModuleState>().pagesModule;
        // let pageIds: string[] = Object.keys(pagesModuleState.pageIdToViewClassMap);
        // for (let singlePageId of pageIds) {
        //     let tempPageClass = pagesModuleState.pageIdToViewClassMap[singlePageId];
        //     this.viewStack.addViewClass(tempPageClass, singlePageId);
        // }

        const appState: PagesModuleState = appStorage().getState<PagesModuleState>();
        let pageIds: string[] = Object.keys(appState.pages.pageIdToViewClassMap);
        for (let singlePageId of pageIds) {
            let tempPageClass = appState.pages.pageIdToViewClassMap[singlePageId];
            this.viewStack.addViewClass(tempPageClass, singlePageId);
        }

        this.commitPagesData();
    }

    protected addListeners(): void {
        super.addListeners();

        // this.eventListenerHelper.addEventListener(
        //     this.pagesModel,
        //     PagesModelEvent.PAGE_ID_CHANGE,
        //     this.onPageIdChange
        // );
        // this.reduxUnsubscribe = reduxStore.subscribe(
        //     () => {

        //     }
        // )
    }

    // protected onPageIdChange(): void {
    //     this.commitPagesData();
    // }

    public commitPagesData(): void {
        this.viewStack.selectedId = appStorage().getState<PagesModuleState>().pages.pageId;

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.viewStack.resize(this.resizeSize.x, this.resizeSize.y);

        if (this.viewStack.selectedItem) {
            this.viewStack.selectedItem.contentScale;

            appStorage().change<PagesModuleState>()(
                "pages.activePageContentScale",
                {
                    x: this.viewStack.selectedItem.contentScale.x,
                    y: this.viewStack.selectedItem.contentScale.y
                }
            );
        }
    }
}
