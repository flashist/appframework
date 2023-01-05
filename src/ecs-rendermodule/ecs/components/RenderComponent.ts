import { DisplayObject } from "@flashist/flibs"

export const RenderComponentType = "render";

export const RenderComponentDefaultValue = {
    type: RenderComponentType as typeof RenderComponentType,
    view: null as DisplayObject,
    containerId: null as string
}

export type RenderComponent = typeof RenderComponentDefaultValue