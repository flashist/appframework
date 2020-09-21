import {BaseObject, ArrayTools, AssociativeArray} from "@flashist/fcore";
import {InteractiveEvent} from "@flashist/flibs";

import {IToggableItem} from "./IToggableItem";
import {ToggleGroupEvent} from "./ToggleGroupEvent";

export class ToggleGroup<IToggleItemType extends IToggableItem = IToggableItem> extends BaseObject {

    protected itemsToIdMap: AssociativeArray<IToggleItemType>;

    private _selectedItem: IToggleItemType;
    // protected toggleItems: IToggleItemType[];
    protected _selectedId: string = "";

    construction(...args) {
        super.construction(...args);

        // this.toggleItems = [];
        this.itemsToIdMap = new AssociativeArray<IToggleItemType>();
    }

    destruction(): void {
        super.destruction();

        if (this.itemsToIdMap) {
            this.itemsToIdMap.destruction();
        }
    }

    protected processItemTap(item: IToggleItemType): void {
        this.selectedId = item.id;
    }

    protected addItemListeners(item: IToggleItemType): void {
        if (!item) {
            return;
        }

        this.eventListenerHelper.addEventListener(
            item,
            InteractiveEvent.TAP,
            () => {
                this.processItemTap(item);
            }
        );
    }

    protected removeItemListeners(item: IToggleItemType): void {
        if (!item) {
            return;
        }

        this.eventListenerHelper.removeAllListeners(item);
    }


    addItem(item: IToggleItemType): void {
        // if (this.toggleItems.indexOf(item) != -1) {
        if (this.itemsToIdMap.getItem(item.id)) {
            return;
        }

        // this.toggleItems.push(item);
        this.itemsToIdMap.push(item, item.id);

        this.addItemListeners(item);
    }

    removeItem(item: IToggleItemType): void {
        if (this.selectedItem == item) {
            this.selectedId = null;
        }

        // ArrayTools.removeItem(this.toggleItems, item);
        this.itemsToIdMap.remove(item);

        this.removeItemListeners(item);
    }

    removeAllItems(): void {
        const itemsCopy: IToggleItemType[] = this.itemsToIdMap.getAllItems();
        for (const item of itemsCopy) {
            this.removeItem(item);
        }
    }

    /*get selectedItem(): IToggleItemType {
        return this._selectedItem;
    }
    set selectedItem(value: IToggleItemType) {
        if (value == this._selectedItem) {
            return;
        }
        if (value && this.toggleItems.indexOf(value) == -1) {
            return;
        }

        // Reset the previous selected item
        if (this._selectedItem) {
            this._selectedItem.selected = false;
        }

        this._selectedItem = value;
        // Setup the new selected item
        if (this._selectedItem) {
            this._selectedItem.selected = true;
        }

        this.commitData();

        this.dispatchEvent(ToggleGroupEvent.SELECTED_ID_CHANGE);
    }*/

    public get selectedId(): string {
        return this._selectedId;
    }
    public set selectedId(value: string) {
        if (this._selectedId === value) {
            return;
        }

        // Reset the previous selected item
        if (this._selectedItem) {
            this._selectedItem.selected = false;
        }

        this._selectedId = value;
        this._selectedItem = this.itemsToIdMap.getItem(this._selectedId);
        // Setup the new selected item
        if (this._selectedItem) {
            this._selectedItem.selected = true;
        }

        this.dispatchEvent(ToggleGroupEvent.SELECTED_ID_CHANGE);
    }

    public get selectedItem(): IToggleItemType {
        return this._selectedItem;
    }
}