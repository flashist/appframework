import { ArrayTools, UniqueTools } from "@flashist/fcore";
import { BaseAppManager } from "../../base/managers/BaseAppManager";
import { appStorage } from "../../state/AppStateModule";
import { TimeModuleAppState } from "../../time/data/state/TimeModuleAppState";
import { TimeManagerEvent } from "../../time/managers/TimeManagerEvent";
import { IComponent } from "../ecs/components/IComponent";
import { IEntity } from "../ecs/entities/IEntity";
import { EntitiesQuery } from "../ecs/entities/queries/EntitiesQuery";
import { System } from "../ecs/systems/System";

export class ECSManager extends BaseAppManager {

    private entityIdsPoolName: string = "ecsManagerEntitiesIdPool";

    protected entitiesList: IEntity[] = [];

    protected queriesToTypesMap: {
        [includeTypesSortedKey: string]: {
            [excludeTypesSortedKey: string]: EntitiesQuery
        }
    } = {};

    protected queriesList: EntitiesQuery[] = [];

    protected systemsList: System[] = [];

    protected timeState: TimeModuleAppState;

    protected entitiesUniquePoolId: string = "ecsEntitiesUniquePool";

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.timeState = appStorage().getState<TimeModuleAppState>();
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            TimeManagerEvent.UPDATE,
            this.onTimeUpdate
        );
    }

    protected onTimeUpdate(): void {
        this.update(this.timeState.time.lastTimeDelta);
    }

    public entities = {
        create: (entity: IEntity): IEntity => {
            const result: IEntity = {
                ...entity,
                id: UniqueTools.getUniqueIdForPool(this.entitiesUniquePoolId)
            }

            this.entities.add(result);

            return result;
        },
        add: (entity: IEntity) => {
            if (this.entitiesList.indexOf(entity) !== -1) {
                return;
            }

            if (!entity.id) {
                entity.id = UniqueTools.getObjectUniqueId(this.entityIdsPoolName);
            }

            this.entitiesList.push(entity);

            this.addEntityToQueries(entity);
        },
        remove: (entity: IEntity) => {
            ArrayTools.removeItem(this.entitiesList, entity);

            this.removeEntityFromAllQueries(entity);
        },
        addComponents: (entity: IEntity, ...components: IComponent[]) => {
            for (let singleComponent of components) {
                entity.components[singleComponent.type] = singleComponent;
            }

            this.updateAllQueriesForEntity(entity);
        },
        removeComponents: (entity: IEntity, ...componentTypes: string[]) => {
            for (let singleComponentType of componentTypes) {
                delete entity.components[singleComponentType];
            }

            this.updateAllQueriesForEntity(entity);
        }
    };

    public queries = {
        get: <EntityType extends IEntity>(includeTypes: string[], excludeTypes?: string[]): EntitiesQuery<EntityType> => {
            const includeTypesSortedKey: string = includeTypes.concat().sort().join();
            let excludeTypesSortedKey: string = "";
            if (excludeTypes) {
                excludeTypesSortedKey = excludeTypes.concat().sort().join();
            }

            let result: EntitiesQuery<EntityType> = this.queriesToTypesMap[includeTypesSortedKey]?.[excludeTypesSortedKey] as any;
            if (!result) {
                result = new EntitiesQuery(includeTypes, excludeTypes);
                if (!this.queriesToTypesMap[includeTypesSortedKey]) {
                    this.queriesToTypesMap[includeTypesSortedKey] = {};
                }
                this.queriesToTypesMap[includeTypesSortedKey][excludeTypesSortedKey] = result;
                this.queriesList.push(result);

                this.updateAllEntitiesForQuery(result);
            }

            return result;
        }
    }

    protected addEntityToQueries(entity: IEntity, queries?: EntitiesQuery[]): void {

        if (!queries) {
            queries = this.queriesList;
        }

        for (let singleQuery of queries) {
            if (singleQuery.entities.indexOf(entity) === -1) {
                let hasAllIncludeTypes: boolean = true;
                for (let singleQueryIncludeType of singleQuery.includeTypes) {
                    if (!entity.components[singleQueryIncludeType]) {
                        hasAllIncludeTypes = false;
                        break;
                    }
                }

                let hasAnyExcludeTypes: boolean = false;
                if (hasAllIncludeTypes) {
                    for (let singleQueryExcludeType of singleQuery.excludeTypes) {
                        if (entity.components[singleQueryExcludeType]) {
                            hasAnyExcludeTypes = true;
                            break;
                        }
                    }
                }

                if (hasAllIncludeTypes && !hasAnyExcludeTypes) {
                    singleQuery.addEntity(entity);
                }
            }
        }
    }

    protected removeEntityFromAllQueries(entity: IEntity): void {
        for (let singleQuery of this.queriesList) {
            singleQuery.removeEntity(entity);
        }
    }

    protected updateAllQueriesForEntity(entity: IEntity): void {
        this.removeEntityFromAllQueries(entity);
        this.addEntityToQueries(entity);
    }

    protected updateAllEntitiesForQuery(query: EntitiesQuery): void {
        for (let singleEntity of this.entitiesList) {
            this.addEntityToQueries(singleEntity, [query]);
        }
    }

    public systems = {
        add: (system: System) => {
            if (this.systemsList.indexOf(system) !== -1) {
                return;
            }

            this.systemsList.push(system);
        }
    };

    public update(timeDelta: number): void {
        for (let singleSystem of this.systemsList) {
            singleSystem.update(timeDelta);
        }
    }
}