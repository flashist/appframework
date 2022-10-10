import {AssociativeArray, IConstructor} from "@flashist/fcore";

import {BaseAppGenericObjectsModel} from "../../base/models/BaseAppGenericObjectsModel";
import {PagesModelEvent} from "./PagesModelEvent";

export class PagesModel extends BaseAppGenericObjectsModel {

    private _pageId: string;

    protected pageIdToViewClassMap: AssociativeArray<IConstructor>;

    constructor() {
        super();

        this.pageIdToViewClassMap = new AssociativeArray<IConstructor>();
    }

    addPageViewClass(Class: IConstructor, id: string): void {
        this.pageIdToViewClassMap.push(Class, id);
    }

    public getPageIdToViewClassMap(): AssociativeArray<IConstructor> {
        return this.pageIdToViewClassMap.clone();
    }

    get pageId(): string {
        return this._pageId;
    }
    set pageId(value: string) {
        if (value === this._pageId) {
            return;
        }

        this._pageId = value;

        this.dispatchEvent(PagesModelEvent.PAGE_ID_CHANGE);
    }
}