import {FContainer} from "@flashist/flibs";

import {BaseManager} from "../../base/managers/BaseManager";

export class ContainersManager extends BaseManager {

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