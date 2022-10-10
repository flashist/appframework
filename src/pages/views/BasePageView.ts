import { DisplayResizeTools, FContainer, getInstance, Graphics, Point, Rectangle } from "@flashist/flibs";

import { BaseAppView } from "../../base/views/BaseAppView";
import { AppConfigModel } from "../../app/models/AppConfigModel";

export class BasePageView extends BaseAppView {

    protected appConfigModel: AppConfigModel;

    protected sizeArea: Rectangle;
    protected sizeAreaView: Graphics;

    protected contentCont: FContainer;
    protected reversedScaleContentScreenSize: Point;

    protected construction(...args): void {
        super.construction(args);

        this.appConfigModel = getInstance(AppConfigModel);

        this.sizeArea = new Rectangle();
        if (this.appConfigModel.appConfig.sizeArea) {
            this.sizeArea = new Rectangle(
                this.appConfigModel.appConfig.sizeArea.x,
                this.appConfigModel.appConfig.sizeArea.y,
                this.appConfigModel.appConfig.sizeArea.width,
                this.appConfigModel.appConfig.sizeArea.height
            )
        }

        this.reversedScaleContentScreenSize = new Point();

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);
        this.contentCont.interactive = true;

        this.sizeAreaView = new Graphics();
        this.contentCont.addChild(this.sizeAreaView);
        //
        this.sizeAreaView.beginFill(0x000000, 0.5);
        this.sizeAreaView.drawRect(
            this.sizeArea.x,
            this.sizeArea.y,
            this.sizeArea.width,
            this.sizeArea.height
        );
        this.sizeAreaView.endFill();
        this.sizeAreaView.alpha = 0;
    }

    protected arrange(): void {
        super.arrange();

        // Reset previous scale
        this.contentCont.scale.set(1, 1);

        // Scale according to the current size
        let tempScale: number = DisplayResizeTools.getScale(
            this.sizeArea.width,
            this.sizeArea.height,
            this.resizeSize.x,
            this.resizeSize.y
        );
        this.contentCont.scale.set(tempScale);
        /*this.contentCont.x = this.sizeArea.x + Math.floor((this.resizeSize.x - this.contentCont.width) / 2);
        this.contentCont.y = this.sizeArea.y + Math.floor((this.resizeSize.y - this.contentCont.height) / 2);*/
        this.contentCont.x = Math.floor((this.resizeSize.x - (this.sizeArea.width * tempScale)) / 2);
        this.contentCont.x -= Math.floor(this.sizeArea.x * tempScale);
        this.contentCont.y = Math.floor((this.resizeSize.y - (this.sizeArea.height * tempScale)) / 2);
        this.contentCont.y -= Math.floor(this.sizeArea.y * tempScale);

        this.reversedScaleContentScreenSize.x = Math.floor(this.resizeSize.x / this.contentCont.scale.x);
        this.reversedScaleContentScreenSize.y = Math.floor(this.resizeSize.y / this.contentCont.scale.y);
    }
}