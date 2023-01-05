import { BaseObject } from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";
import { ECSManager } from "../../managers/ECSManager";
import { IEntity } from "../entities/IEntity";
import { EntitiesQuery } from "../entities/queries/EntitiesQuery";
import { EntitiesQueryEvent } from "../entities/queries/EntitiesQueryEvent";

export abstract class System<EntityType extends IEntity = IEntity> extends BaseObject {

    protected ecsManager: ECSManager = getInstance(ECSManager);

    protected query: EntitiesQuery<EntityType>;

    protected includeTypes: string[];
    protected excludeTypes: string[];

    constructor(includeTypes: string[], excludeTypes: string[] = []) {
        super(includeTypes, excludeTypes)
    }

    protected construction(includeTypes: string[], excludeTypes: string[] = []): void {
        super.construction();

        this.ecsManager = getInstance(ECSManager);

        this.includeTypes = includeTypes;
        this.excludeTypes = excludeTypes;

        this.query = this.ecsManager.queries.get<EntityType>(this.includeTypes, this.excludeTypes);
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.query,
            EntitiesQueryEvent.ENTITY_ADDED,
            this.onEntityAdded
        );

        this.eventListenerHelper.addEventListener(
            this.query,
            EntitiesQueryEvent.ENTITY_REMOVED,
            this.onEntityRemoved
        );
    }

    protected onEntityAdded(entity: EntityType): void {
        // TODO: implement in subclasses when needed
    }

    protected onEntityRemoved(entity: EntityType): void {
        // TODO: implement in subclasses when needed
    }

    public update(timeDelta: number): void {
        // TODO: implement in subclasses when needed
    }
}