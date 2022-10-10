import {ResizableContainer} from "../../display/views/resize/ResizableContainer";
import {ViewLazyCreationServiceLocatorStack} from "../../display/views/viewstack/ViewLazyCreationServiceLocatorStack";
import {PagesModel} from "../models/PagesModel";
import {getInstance} from "@flashist/flibs";
import {PagesModelEvent} from "../models/PagesModelEvent";

export class PagesView extends ResizableContainer {

    protected pagesModel: PagesModel;

    public viewStack: ViewLazyCreationServiceLocatorStack;

    protected construction(...args): void {
        super.construction(args);

        this.pagesModel = getInstance(PagesModel);

        this.viewStack = new ViewLazyCreationServiceLocatorStack();
        this.addChild(this.viewStack);

        let pageIdToViewClassMap = this.pagesModel.getPageIdToViewClassMap();
        let pageIds: string[] = pageIdToViewClassMap.getAllKeys();
        let pageIdsCount: number = pageIds.length;
        for (let pageIdIndex: number = 0; pageIdIndex < pageIdsCount; pageIdIndex++) {
            let tempPageClass = pageIdToViewClassMap.getItemByIndex(pageIdIndex);
            let tempPageId: string = pageIds[pageIdIndex];

            this.viewStack.addViewClass(tempPageClass, tempPageId);
        }

        this.commitPagesData();
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.pagesModel,
            PagesModelEvent.PAGE_ID_CHANGE,
            this.onPageIdChange
        );
    }

    protected onPageIdChange(): void {
        this.commitPagesData();
    }

    protected commitPagesData(): void {
        this.viewStack.selectedId = this.pagesModel.pageId;
    }

    protected arrange(): void {
        super.arrange();

        this.viewStack.resize(this.resizeSize.x, this.resizeSize.y);
    }
}