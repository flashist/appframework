import { IComponent } from "../components/IComponent";

export interface IEntity<ComponentTypes extends IComponent = IComponent> {
    id: string;
    // components: Record<ComponentKeys, ComponentTypes>
    components: {
        // [key in ComponentTypes["type"]]: ComponentTypes

        // [key in ComponentTypes["type"]]: {
        //     [Property in keyof ComponentTypes]: ComponentTypes[Property]
        // }

        [K in ComponentTypes as K["type"]]: K
    }
}