import { DisplayObjectContainer, FContainer, getInstance } from "@flashist/flibs";
import { ContainersManager } from "../../../containers/managers/ContainersManager";
import { IEntity } from "../../../ecs/ecs/entities/IEntity";
import { System } from "../../../ecs/ecs/systems/System";
import { RenderModuleRootContainerId } from "../../data/RenderModuleRootContinerId";
import { RenderComponent, RenderComponentType } from "../components/RenderComponent";


export class RenderSystem<EntityType extends IEntity<RenderComponent>> extends System<EntityType> {

    protected rootContainer: DisplayObjectContainer;

    constructor() {
        super([RenderComponentType]);
    }

    protected construction(includeTypes: string[], excludeTypes?: string[]): void {
        super.construction(includeTypes, excludeTypes);

        this.rootContainer = new FContainer();

        const containersManager: ContainersManager = getInstance(ContainersManager);
        // as any - to solve some type-related problems between modules
        containersManager.addContainer(this.rootContainer as any, RenderModuleRootContainerId);
    }

    protected onEntityAdded(entity: EntityType): void {
        super.onEntityAdded(entity);

        this.rootContainer.addChild(entity.components.render.view);
    }

    protected onEntityRemoved(entity: EntityType): void {
        super.onEntityAdded(entity);

        this.rootContainer.removeChild(entity.components.render.view);
    }
}