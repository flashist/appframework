import { PagesView } from "../../pages/views/PagesView";
import { ResizableContainer } from "../../display/views/resize/ResizableContainer";
import { BaseAppView } from "../../base/views/BaseAppView";
import { DisplayObjectContainer, Graphics } from '@flashist/flibs';

export class AppMainContainer extends BaseAppView {

    protected bg: DisplayObjectContainer;
    protected bgColor: number;
    protected bgAlpha: number;

    protected pagesView: PagesView;

    protected construction(...args): void {
        this.bgColor = 0xFFFFFF;
        this.bgAlpha = 0;

        super.construction(...args);

        this.bg = this.createBg();
        this.addChild(this.bg);

        this.pagesView = new PagesView();
        this.addChild(this.pagesView);
    }

    protected arrange(): void {
        super.arrange();

        // Make the bg a bit bigger to cover the whole screen 100%
        this.bg.width = this.resizeSize.x + 2;
        this.bg.height = this.resizeSize.y + 2;

        this.pagesView.resize(
            this.resizeSize.x,
            this.resizeSize.y
        );
    }

    protected createBg(): DisplayObjectContainer {
        let result: Graphics = new Graphics();
        result.beginFill(this.bgColor, this.bgAlpha);

        return result;
    }
}