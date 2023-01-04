import { DisplayResizeTools, FContainer, getInstance, Graphics, Point, Rectangle } from "@flashist/flibs";
import { AppModuleState } from "../../app/data/state/AppModuleState";

import { BaseAppView } from "../../base/views/BaseAppView";
import { appStorage } from "../../state/AppStateModule";

export class BasePageView extends BaseAppView {

    // protected appConfigModel: AppConfigModel;

    private _sizeArea: Rectangle;
    protected sizeAreaView: Graphics;

    protected contentCont: FContainer;
    protected reversedScaleContentScreenRect: Rectangle;

    protected reversedScaleContentLocalPosCached: Point;
    protected reversedScaleContentGlobalPosCached: Point;

    protected construction(...args): void {
        super.construction(args);

        // appState.app.config = getInstance(AppConfigModel);

        this.reversedScaleContentScreenRect = new Rectangle();
        this.reversedScaleContentLocalPosCached = new Point();
        this.reversedScaleContentGlobalPosCached = new Point();

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);
        this.contentCont.interactive = true;

        this.sizeAreaView = new Graphics();
        this.contentCont.addChild(this.sizeAreaView);
        //
        this.sizeAreaView.alpha = 0;

        this._sizeArea = new Rectangle();

        const appState = appStorage().getState<AppModuleState>();
        if (appState.app.config.sizeArea) {
            this._sizeArea = new Rectangle(
                appState.app.config.sizeArea.x || 0,
                appState.app.config.sizeArea.y || 0,
                appState.app.config.sizeArea.width || 0,
                appState.app.config.sizeArea.height || 0
            );
        }
        //
        this.updateSizeAreaView();
    }

    public get sizeArea(): Rectangle {
        return this._sizeArea;
    }

    public set sizeArea(value: Rectangle) {
        if (value.x === this.sizeArea.x &&
            value.y === this.sizeArea.y &&
            value.width === this.sizeArea.width &&
            value.height === this.sizeArea.height) {
            return;
        }

        this.sizeArea.copyFrom(value);

        this.updateSizeAreaView();
    }

    protected updateSizeAreaView(): void {
        this.sizeAreaView.clear();
        //
        this.sizeAreaView.beginFill(0x0000FF, 0.5);
        this.sizeAreaView.drawRect(
            this.sizeArea.x,
            this.sizeArea.y,
            this.sizeArea.width,
            this.sizeArea.height
        );
        this.sizeAreaView.endFill();
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

        this.reversedScaleContentLocalPosCached.x = this.contentCont.x;
        this.reversedScaleContentLocalPosCached.y = this.contentCont.y;
        this.contentCont.toGlobal(this.reversedScaleContentLocalPosCached, this.reversedScaleContentGlobalPosCached);
        //
        this.reversedScaleContentScreenRect.x = this.reversedScaleContentGlobalPosCached.x;
        this.reversedScaleContentScreenRect.y = this.reversedScaleContentGlobalPosCached.y;
        this.reversedScaleContentScreenRect.width = Math.floor(this.resizeSize.x / this.contentCont.scale.x);
        this.reversedScaleContentScreenRect.height = Math.floor(this.resizeSize.y / this.contentCont.scale.y);
    }
}