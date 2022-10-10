import {AssociativeArray} from "@flashist/fcore";

import {BaseAppModel} from "../../base/models/BaseAppModel";
import {BaseStrategy} from "../strategies/BaseStrategy";

export class BaseStrategyModel<StrategyType extends BaseStrategy = BaseStrategy> extends BaseAppModel {

    protected strategyToIdMap: AssociativeArray<StrategyType> = new AssociativeArray<StrategyType>();

    private _strategyId: string = "";

    public addStrategy(strategy: StrategyType, id: string): void {
        this.strategyToIdMap.push(strategy, id);
    }

    public removeStrategy(id: string): void {
        this.strategyToIdMap.removeByKey(id);
    }

    public getStrategyById(id: string): StrategyType {
        if (!this.strategyToIdMap.containsKey(id)) {
            console.log("BaseStrategyModel | getStrategyForId __ WARNING! Can't find strategy for id: ", id);
        }

        return this.strategyToIdMap.getItem(id);
    }


    get strategyId(): string {
        return this._strategyId;
    }

    set strategyId(value: string) {
        if (value === this._strategyId) {
            return;
        }

        this._strategyId = value;
    }
}