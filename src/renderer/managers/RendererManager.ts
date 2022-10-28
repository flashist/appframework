import * as PIXI from "pixi.js";

import { AppProperties, FApp, getInstance, Point } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { Facade } from "../../facade/Facade";
import { RendererManagerEvent } from "../events/RendererManagerEvent";
import { RendererManagerConfigVO } from "../data/RendererManagerConfigVO";

export class RendererManager extends BaseAppManager {

    protected config: RendererManagerConfigVO;

    protected construction(): void {
        super.construction();

        this.config = getInstance(RendererManagerConfigVO);

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
        Facade.instance.app.renderer.view.style.position = "absolute";
        Facade.instance.app.renderer.view.style.top = "0px";
        Facade.instance.app.renderer.view.style.left = "0px";

        // Append the renderer canvas to DOM
        document.body.appendChild(Facade.instance.app.view);
    }

    public resize(width: number, height: number, pixelRatio: number): void {
        this.dispatchEvent(RendererManagerEvent.PRE_RESIZE_HOOK, new Point(width, height));

        Facade.instance.app.renderer.resize(width * pixelRatio, height * pixelRatio);
        Facade.instance.app.renderer.view.style.width = width + "px";
        Facade.instance.app.renderer.view.style.height = height + "px";

        this.dispatchEvent(RendererManagerEvent.RESIZE);
    }

    public get rendererWidth(): number {
        return Facade.instance.app.renderer.width;
    }

    public get rendererHeight(): number {
        return Facade.instance.app.renderer.height;
    }
}