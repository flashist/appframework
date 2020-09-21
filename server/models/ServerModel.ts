import {BaseModel} from "../../base/models/BaseModel";

export class ServerModel extends BaseModel {

    private _clientTimeWhenServerTimeChanged: number = 0;

    private _serverTime: number = 0;
    get serverTime(): number {
        return this._serverTime;
    }
    set serverTime(value: number) {
        if (value === this.serverTime) {
            return;
        }

        this._serverTime = value;
        this._clientTimeWhenServerTimeChanged = Date.now();
    }

    get clientTimeWhenServerTimeChanged(): number {
        return this._clientTimeWhenServerTimeChanged;
    }
    set clientTimeWhenServerTimeChanged(value: number) {
        throw new Error("ERROR! The param 'clientTimeWhenServerTimeChanged' can't be changed directly!");
    }

    get clientTimeDeltaSinceServerTimeChanged(): number {
        return Date.now() - this._clientTimeWhenServerTimeChanged;
    }

    get clientToServerTimeDelta(): number {
        return this._clientTimeWhenServerTimeChanged - this._serverTime;
    }
}