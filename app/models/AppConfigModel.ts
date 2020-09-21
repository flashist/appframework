import {ObjectTools} from "@flashist/fcore";
import {getInstance} from "@flashist/flibs";

import {IAppConfigVO} from "../data/IAppConfigVO";
import {BaseModel} from "../../base/models/BaseModel";
import {DefaultAppConfigVO} from "../data/DefaultAppConfigVO";

export class AppConfigModel extends BaseModel {

    public appConfig: IAppConfigVO;

    protected construction(): void {
        super.construction();

        this.appConfig = getInstance(DefaultAppConfigVO);
    }

    public changeConfig(changeData: Partial<IAppConfigVO>): void {
        ObjectTools.copyProps(
            this.appConfig,
            changeData
        );
    }

}