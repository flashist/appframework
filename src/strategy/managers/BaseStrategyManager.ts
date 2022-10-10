import {BaseAppManager} from "../../base/managers/BaseAppManager";
import {BaseStrategyModel} from "../models/BaseStrategyModel";
import {BaseStrategy} from "../strategies/BaseStrategy";

export abstract class BaseStrategyManager<
        StrategyType extends BaseStrategy = BaseStrategy,
        StrategyModelType extends BaseStrategyModel<StrategyType> = BaseStrategyModel<StrategyType>
    > extends BaseAppManager {

    protected strategyModel: StrategyModelType;
    protected lastActiveStrategy: StrategyType;

    /**
     * It's supposed, that there is an external common-purpose model,
     * which provides some data (e.g. the ID of an active item),
     * and based on this data the manager should make the decision,
     * about which specific id for a strategy should be used.
     */
    protected abstract findIdForCurrentStrategy(): string;

    protected commitStrategyData(): void {
        const newToolStrategy: StrategyType = this.strategyModel.getStrategyById(this.findIdForCurrentStrategy());
        if (this.lastActiveStrategy === newToolStrategy) {
            return;
        }

        if (this.lastActiveStrategy) {
            this.lastActiveStrategy.deactivate();
        }

        this.lastActiveStrategy = newToolStrategy;
        if (this.lastActiveStrategy) {
            this.lastActiveStrategy.activate();
        }
    }

}