import { ArrayTools, BaseObject } from "@flashist/fcore";
import { IEntity } from "../IEntity";
import { EntitiesQueryEvent } from "./EntitiesQueryEvent";

export class EntitiesQuery<EntityType extends IEntity = IEntity> extends BaseObject {

    protected _entities: EntityType[] = [];

    constructor(public includeTypes: string[], public excludeTypes: string[] = []) {
        super();
    }

    public get entities(): Readonly<typeof this._entities> {
        return this._entities;
    }

    public addEntity(entity: EntityType): void {
        if (this._entities.indexOf(entity) !== -1) {
            return;
        }

        this._entities.push(entity);

        this.dispatchEvent(EntitiesQueryEvent.ENTITY_ADDED, entity);
    }

    public removeEntity(entity: EntityType): void {
        if (this._entities.indexOf(entity) === -1) {
            return;
        }

        ArrayTools.removeItem(this._entities, entity);

        this.dispatchEvent(EntitiesQueryEvent.ENTITY_REMOVED, entity);
    }
}