import {GenericObjectsModel} from "@flashist/flibs";

import {AppConfigVO} from "../data/AppConfigVO";
import {AppConfigType} from "../data/AppConfigType";

export class AppConfigModel<ConfigDataType extends AppConfigVO = AppConfigVO>
    extends GenericObjectsModel<ConfigDataType> {

    constructor() {
        super();

        this.itemsType = AppConfigType;
        this.DefaultItemClass = (AppConfigVO as any);
    }

    public get appConfig(): ConfigDataType {
        return this.items.getItemByIndex(0);
    }

}