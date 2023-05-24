import { DisplayObject } from "@flashist/flibs"

export const RenderComponentType = "render";

export const RenderComponentDefaultValue = {
    type: RenderComponentType as typeof RenderComponentType,
    view: null as DisplayObject,
    containerId: null as string
}

// export type RenderComponent = typeof RenderComponentDefaultValue
export type RendererPlugins<ViewType extends DisplayObject = DisplayObject> = {
    type: typeof RenderComponentType;
    view: ViewType;
    containerId: string;
}