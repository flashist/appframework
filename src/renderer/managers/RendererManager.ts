import * as PIXI from "pixi.js";

import { AppProperties, FApp, getInstance, Point, Rectangle } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { Facade } from "../../facade/Facade";
import { RendererManagerEvent } from "../events/RendererManagerEvent";
import { RendererManagerConfigVO } from "../data/RendererManagerConfigVO";

export class RendererManager extends BaseAppManager {

    protected config: RendererManagerConfigVO;

    protected padding: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };

    protected construction(): void {
        super.construction();

        this.config = getInstance(RendererManagerConfigVO);

        this.padding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };

        if (this.config.targetFps) {
            PIXI.settings.TARGET_FPMS = this.config.targetFps / 1000;
        }

        const appConfig: AppProperties = Object.assign({}, this.config);
        Facade.instance.app = new FApp(appConfig);

        // Stage
        Facade.instance.app.stage.interactive = true;

        // Renderer
        // Facade.instance.app.renderer.autoDensity = true;
        // CSS settings
        // (Facade.instance.app.renderer.view.style as any).position = "absolute";
        // (Facade.instance.app.renderer.view.style as any).top = "0px";
        // (Facade.instance.app.renderer.view.style as any).left = "0px";
        if (this.config.canvasCss) {
            const canvasKeys: string[] = Object.keys(this.config.canvasCss);
            for (let singleCssKey of canvasKeys) {
                (Facade.instance.app.renderer.view.style as any)[singleCssKey] = this.config.canvasCss[singleCssKey];
            }
        }

        let canvasParentElement = document.body;
        if (this.config.canvasParentElementId) {
            canvasParentElement = document.getElementById(this.config.canvasParentElementId);
        }

        // Append the renderer canvas to DOM
        canvasParentElement.appendChild(Facade.instance.app.view as any);
    }

    public resize(htmlWidth: number, htmlHeight: number, pixelRatio: number): void {

        let horizontalPadding: number = 0;
        if (this.padding.left) {
            horizontalPadding += this.padding.left;
        }
        if (this.padding.right) {
            horizontalPadding += this.padding.right;
        }

        let verticalPaddig: number = 0;
        if (this.padding.top) {
            verticalPaddig += this.padding.top;
        }
        if (this.padding.bottom) {
            verticalPaddig += this.padding.bottom;
        }

        let canvasWidth: number = htmlWidth - horizontalPadding;
        let canvasHeight: number = htmlHeight - verticalPaddig;

        this.dispatchEvent(RendererManagerEvent.PRE_RESIZE_HOOK, new Point(canvasWidth, canvasHeight));

        Facade.instance.app.renderer.resize(canvasWidth * pixelRatio, canvasHeight * pixelRatio);
        Facade.instance.app.renderer.view.style.width = canvasWidth + "px";
        Facade.instance.app.renderer.view.style.height = canvasHeight + "px";

        if (this.padding.top) {
            (Facade.instance.app.renderer.view.style as any).top = this.padding.top + "px";
        }
        if (this.padding.bottom) {
            (Facade.instance.app.renderer.view.style as any).bottom = this.padding.bottom + "px";
        }
        if (this.padding.left) {
            (Facade.instance.app.renderer.view.style as any).left = this.padding.left + "px";
        }
        if (this.padding.right) {
            (Facade.instance.app.renderer.view.style as any).right = this.padding.right + "px";
        }

        this.dispatchEvent(RendererManagerEvent.RESIZE);
    }

    public get rendererWidth(): number {
        return Facade.instance.app.renderer.width;
    }

    public get rendererHeight(): number {
        return Facade.instance.app.renderer.height;
    }

    public showView(): void {
        (Facade.instance.app.renderer.view.style as any).display = "none";
    }

    public hideView(): void {
        delete (Facade.instance.app.renderer.view.style as any).display;
    }
}