export class RendererManagerConfigVO {
    antialias: boolean = true;
    backgroundAlpha: number = 0

    targetFps?: number;

    canvasCss: any = {
        position: "absolute",
        top: "0px",
        left: "0px"
    };

    canvasParentElementId?: string;
}