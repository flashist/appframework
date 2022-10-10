import {GenericObjectsByTypeModel, getInstance} from "@flashist/flibs";

import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {IServerResponseVO} from "../data/IServerResponseVO";
import {ServerModel} from "../models/ServerModel";
import {IServerRequestVO} from "../data/IServerRequestVO";

/**
 * The class is not prepared fully and at the current moment
 * is substituted by game-level command, which emulates connection with server-side.
 */
export abstract class BaseServerCommand
    <
        ResponseType extends IServerResponseVO = IServerResponseVO,
        RequestType extends IServerRequestVO = IServerRequestVO,
    >
    extends BaseAppCommand<ResponseType> {

    protected serverModel: ServerModel = getInstance(ServerModel);
    protected genericByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);

    constructor(protected requestData: RequestType) {
        super()
    }

    protected notifyComplete(resolveData?: ResponseType, rejectErrorData?: any): void {
        if (resolveData.errorCode) {
            this.errorCode = resolveData.errorCode;
        }
        if (resolveData.time || resolveData.time === 0) {
            this.serverModel.serverTime = resolveData.time;
        }
        if (resolveData.items) {
            this.genericByTypeModel.commitItems(resolveData.items);
        }

        super.notifyComplete(resolveData, rejectErrorData);
    }
}