import {FContainer} from "@flashist/flibs";

import {BaseAppManager} from "../../base/managers/BaseAppManager";

export class ContainersManager extends BaseAppManager {

    private containersMap: { [key: string]: FContainer } = {};

    public addContainer(container: FContainer, id: string): void {
        this.containersMap[id] = container;
    }

    public removeContainer(id: string): void {
        delete this.containersMap[id];
    }

    public getContainer(id: string): FContainer {
        let result: FContainer;

        if (this.containersMap[id]) {
            result = this.containersMap[id];
        }

        return result;
    }

}