import * as PIXI from "pixi.js";

import { FApp } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { Facade } from "../../facade/Facade";
import { RendererManagerEvent } from "../events/RendererManagerEvent";

export class RendererManager extends BaseAppManager {

    protected targetFps: number;

    protected construction(targetFps?: number): void {
        super.construction();

        if (this.targetFps) {
            PIXI.settings.TARGET_FPMS = this.targetFps / 1000;
        }

        Facade.instance.app = new FApp(
            {
                targetFps: targetFps
            }
        );

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

    public resize(width: number, height: number): void {
        Facade.instance.app.renderer.resize(width, height);
        this.dispatchEvent(RendererManagerEvent.RESIZE);
    }

    public get rendererWidth(): number {
        return Facade.instance.app.renderer.width;
    }

    public get rendererHeight(): number {
        return Facade.instance.app.renderer.height;
    }
}