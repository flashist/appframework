import {BaseObject} from "@flashist/fcore";
import {StorageModuleConfig} from "../StorageModuleConfig";

export class StorageManager extends BaseObject {

    protected storageId: string;
    protected storageData: any;

    protected construction(): void {
        super.construction();

        this.storageId = StorageModuleConfig.storageId;

        this.prepareStorage();
        this.createStorage();
    }

    protected getWindowStorageObject(): any {
        let rawData: string = localStorage.getItem(this.storageId);
        if (!rawData) {
            rawData = "{}";
        }

        return JSON.parse(rawData);
    }

    public setParam<DataType>(id: keyof DataType, value: DataType[keyof DataType]): void;
    public setParam<ParamType>(id: string, value: ParamType): void;
    public setParam(id: string, value: any): void {
        if (this.storageData[id] === value) {
            return;
        }

        this.storageData[id] = value;
        this.writeSaves();
    }

    public getParam<DataType, ParamType>(id: keyof DataType): ParamType;
    public getParam<DataType>(id: keyof DataType): DataType[keyof DataType];
    public getParam<ParamType>(id: string): ParamType;
    public getParam(id: string): any {
        return this.storageData[id];
    }

    protected writeSaves(): void {
        let rawData: string = JSON.stringify(this.storageData);
        localStorage.setItem(this.storageId, rawData);
    }

    protected createStorage(): void {
        this.storageData = this.getWindowStorageObject();

        if (this.storageData.isCreated) {
            this.initializeStorageData();
        }
    }

    protected initializeStorageData(): void {
        this.storageData.isCreated = true;

        this.writeSaves();
    }

    public clearSaves(): void {
        this.initializeStorageData();
    }

    protected prepareStorage(): void {
        if (!window.localStorage) {
            Object.defineProperty(window, "localStorage", new (function () {
                var aKeys = [], oStorage = {};
                Object.defineProperty(oStorage, "getItem", {
                    value: function (sKey) {
                        return this[sKey] ? this[sKey] : null;
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "key", {
                    value: function (nKeyId) {
                        return aKeys[nKeyId];
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "setItem", {
                    value: function (sKey, sValue) {
                        if (!sKey) {
                            return;
                        }
                        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "length", {
                    get: function () {
                        return aKeys.length;
                    },
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "removeItem", {
                    value: function (sKey) {
                        if (!sKey) {
                            return;
                        }
                        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "clear", {
                    value: function () {
                        if (!aKeys.length) {
                            return;
                        }
                        for (var sKey in oStorage) {
                            document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                        }
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                this.get = function () {
                    var iThisIndx;
                    for (var sKey in oStorage) {
                        iThisIndx = aKeys.indexOf(sKey);
                        if (iThisIndx === -1) {
                            (oStorage as any).setItem(sKey, oStorage[sKey]);
                        }
                        else {
                            aKeys.splice(iThisIndx, 1);
                        }
                        delete oStorage[sKey];
                    }
                    for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
                        (oStorage as any).removeItem(aKeys[0]);
                    }
                    for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                        aCouple = aCouples[nIdx].split(/\s*=\s*/);
                        if (aCouple.length > 1) {
                            oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                            aKeys.push(iKey);
                        }
                    }
                    return oStorage;
                };
                this.configurable = false;
                this.enumerable = true;
            })());
        }
    }
}