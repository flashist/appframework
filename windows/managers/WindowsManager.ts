import {FContainer} from "@flashist/flibs";

import {BaseManager} from "../../base/managers/BaseManager";
import {IWindowConfigVO} from "../data/IWindowConfigVO";
import {IShowWindowVO} from "./IShowWindowVO";
import {BaseWindow} from "../BaseWindow";

export class WindowsManager extends BaseManager {
    protected windowsContainer: FContainer;

    protected windowConfigToTypeMap: { [type: string]: IWindowConfigVO } = {};

    protected windowsToShowQueue: IShowWindowVO[] = [];

    protected shownWindows: BaseWindow[] = [];

    public setup(windowsContainer: FContainer): void {
        this.windowsContainer = windowsContainer;
    }

    public addWindowConfig(config: IWindowConfigVO): void {
        this.windowConfigToTypeMap[config.type] = config;
    }

    public showWindow(type: string, data?: any): void {
        this.windowsToShowQueue.push(
            {
                type: type,
                data: data
            }
        );

        // TODO: at the current moment there is no logic about using queues
        // or to configure how whondows might behave with each other
        // (e.g. the new window might require to hide all others)

        this.showNextWindow();
    }

    protected showNextWindow(): void {
        if (this.windowsToShowQueue.length <= 0) {
            return;
        }

        let tempShowData: IShowWindowVO = this.windowsToShowQueue.shift();
        let tempConfig: IWindowConfigVO = this.windowConfigToTypeMap[tempShowData.type];
        if (!tempConfig) {
            return;
        }

        // TODO: change logic, if more complex relationships between windows required
        // (e.g. some windows might allow to some other windows to be shown)
        this.hideAllWindows();

        let tempWindow: BaseWindow = this.createWindow(tempConfig, tempShowData.data);
        this.windowsContainer.addChild(tempWindow);
    }

    protected createWindow(config: IWindowConfigVO, data?: any): BaseWindow {
        let result = new config.RenderClass();
        result.config = config;
        result.data = data;

        return result;
    }

    public hideAllWindows(): void {
        for (let tempWindow of this.shownWindows) {
            tempWindow.visible = false;
        }
    }
}