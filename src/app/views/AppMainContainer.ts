import { DisplayObjectContainer, Graphics } from '@flashist/flibs';
import { BaseAppView } from "../../base/views/BaseAppView";
import { PagesView } from "../../pages/views/PagesView";
import { AppMainContainerEvent } from "./AppMainContainerEvent";

export class AppMainContainer extends BaseAppView {

    protected bg: DisplayObjectContainer;
    protected pagesView: PagesView;

    protected construction(...args): void {
        super.construction(...args);

        this.bg = this.createBg();
        this.addChild(this.bg);

        this.pagesView = new PagesView();
        this.addChild(this.pagesView);
    }

    protected arrange(): void {
        super.arrange();

        this.globalDispatcher.dispatchEvent(AppMainContainerEvent.PRE_RESIZE);

        // Make the bg a bit bigger to cover the whole screen 100%
        this.bg.width = this.resizeSize.x + 2;
        this.bg.height = this.resizeSize.y + 2;

        this.pagesView.resize(
            this.resizeSize.x,
            this.resizeSize.y
        );

        this.globalDispatcher.dispatchEvent(AppMainContainerEvent.POST_RESIZE);
    }

    protected createBg(): DisplayObjectContainer {
        let result: Graphics = new Graphics();
        result.beginFill(0xFFFFFF, 0);
        result.drawRect(0, 0, 10, 10);

        return result;
    }
}