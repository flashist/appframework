import { DisplayObjectContainer, DisplayTools, FContainer, getInstance } from "@flashist/flibs";
import { ContainersManager } from "../../../containers/managers/ContainersManager";
import { IEntity } from "../../../ecs/ecs/entities/IEntity";
import { System } from "../../../ecs/ecs/systems/System";
import { RenderModuleRootContainerId } from "../../data/RenderModuleRootContainerId";
import { RenderComponent, RenderComponentType } from "../components/RenderComponent";


export class RenderSystem<EntityType extends IEntity<RenderComponent>> extends System<EntityType> {

    protected containersManager: ContainersManager;

    protected rootContainer: FContainer;

    constructor() {
        super([RenderComponentType]);
    }

    protected construction(includeTypes: string[], excludeTypes?: string[]): void {
        super.construction(includeTypes, excludeTypes);

        this.rootContainer = new FContainer();

        this.containersManager = getInstance(ContainersManager);
        // as any - to solve some type-related problems between modules
        this.containersManager.addContainer(this.rootContainer as any, RenderModuleRootContainerId);
    }

    protected onEntityAdded(entity: EntityType): void {
        super.onEntityAdded(entity);

        const tempCont: FContainer = this.getContainer(entity.components.render.containerId);
        tempCont.addChild(entity.components.render.view);
    }

    protected onEntityRemoved(entity: EntityType): void {
        super.onEntityAdded(entity);

        DisplayTools.childRemoveItselfFromParent(entity.components.render.view);
        // this.rootContainer.removeChild(entity.components.render.view);
    }

    protected getContainer(containerId: string): FContainer {
        let result: FContainer;
        if (containerId) {
            result = this.containersManager.getContainer(containerId)
        }

        if (!result) {
            result = this.rootContainer;
        }

        return result;
    }
}