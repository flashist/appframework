import { Container } from "@flashist/flibs"

export const RenderComponentType = "render";

export const RenderComponentDefaultValue = {
    type: RenderComponentType as typeof RenderComponentType,
    view: null as Container,
    containerId: null as string
}

// export type RenderComponent = typeof RenderComponentDefaultValue
export type RenderComponent<ViewType extends Container = Container> = {
    type: typeof RenderComponentType;
    view: ViewType;
    containerId: string;
}