import { DisplayObjectContainer } from "@flashist/flibs";

import { BaseAppManager } from "../../base/managers/BaseAppManager";

export class ContainersManager extends BaseAppManager {

    private containersMap: { [key: string]: DisplayObjectContainer } = {};

    public addContainer(container: DisplayObjectContainer, id: string): void {
        this.containersMap[id] = container;
    }

    public removeContainer(id: string): void {
        delete this.containersMap[id];
    }

    public getContainer(id: string): DisplayObjectContainer {
        let result: DisplayObjectContainer;

        if (this.containersMap[id]) {
            result = this.containersMap[id];
        }

        return result;
    }

}