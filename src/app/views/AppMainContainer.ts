import { PagesView } from "../../pages/views/PagesView";
import { ResizableContainer } from "../../display/views/resize/ResizableContainer";
import { BaseAppView } from "../../base/views/BaseAppView";

export class AppMainContainer extends BaseAppView {

    protected pagesView: PagesView;

    protected construction(...args): void {
        super.construction(...args);

        this.pagesView = new PagesView();
        this.addChild(this.pagesView);
    }

    protected arrange(): void {
        super.arrange();

        this.pagesView.resize(
            this.resizeSize.x,
            this.resizeSize.y
        );
    }
}