import {ArrayTools, Dictionary, IConstructor, Logger, ObjectTools} from "@flashist/fcore";

import {DisplayTools, FContainer, Point} from "@flashist/flibs";

import {ISimpleListItem} from "./ISimpleListItem";
import {ILayoutableContainer} from "../layout/container/ILayoutableContainer";
import {IResizable} from "../resize/IResizable";

export class SimpleList
    <ItemType extends ISimpleListItem = ISimpleListItem, ItemData extends any = any>
    extends FContainer
    implements ILayoutableContainer {

    private _dataProvider: ItemData[];
    private _itemsDataPropertyName: string;
    private _itemsProperties: any;

    private _ItemRendererClass: IConstructor<ItemType>;

    protected items: ItemType[];
    protected cacheItems: ItemType[];

    public useItemsCache: boolean;
    public reuseItemsForConcreteData: boolean;

    protected construction(): void {
        super.construction();

        this._dataProvider = [];
        this.items = [];
        this.cacheItems = [];
        this._itemsDataPropertyName = "data";
    }

    public get ItemRendererClass(): IConstructor<ItemType> {
        return this._ItemRendererClass;
    }
    public set ItemRendererClass(value: IConstructor<ItemType>) {
        if (value == this._ItemRendererClass) {
            return;
        }

        this._ItemRendererClass = value;

        this.commitItemsData();
    }

    get itemsProperties(): any {
        return this._itemsProperties;
    }
    set itemsProperties(value: any) {
        if (value === this._itemsProperties) {
            return;
        }

        this._itemsProperties = value;

        this.commitItemsData();
    }

    public get dataProvider(): ItemData[] {
        return this._dataProvider;
    }
    public set dataProvider(value: ItemData[]) {
        if (!value) {
            value = [];
        }

        if (ArrayTools.checkIfEqual(value, this.dataProvider)) {
            return;
        }

        this._dataProvider = value;

        this.commitItemsData();
    }

    public get itemsDataPropertyName(): string {
        return this._itemsDataPropertyName;
    }
    public set itemsDataPropertyName(value: string) {
        if (value == this._itemsDataPropertyName) {
            return;
        }

        this._itemsDataPropertyName = value;

        this.commitItemsData();
    }


    protected getItemFromCacheToReuse(data: ItemData): ItemType {
        let result: ItemType;
        for (let item of this.cacheItems) {
            if (item[this._itemsDataPropertyName] === data) {
                result = item;
                // Remove item from the cache, to prevent reusing it as a regular cached item
                ArrayTools.removeItem(this.cacheItems, result);
                break;
            }
        }

        return result;
    }

    protected getItemFromCache(): ItemType {
        let result: ItemType;

        if (this.cacheItems.length > 0) {
            result = this.cacheItems.shift();
        }

        return result;
    }

    addItemToCache(item: ItemType): void {
        if (this.cacheItems.indexOf(item) !== -1) {
            return;
        }

        this.cacheItems.push(item);
    }

    removeItemFromCache(item: ItemType): void {
        ArrayTools.removeItem(this.cacheItems, item);
    }

    protected commitItemsData(): void {
        if (!this.ItemRendererClass) {

        } else if (!this.dataProvider) {
            this.removeAllItems();

        } else {
            var tempData: any;
            var tempItem: ItemType;
            var itemIndex: number;
            var itemsCount: number = this.dataProvider.length;


            var prevItems: ItemType[] = this.items.concat();

            if (this.items.length) {
                var maxStepsCount: number = 100000;
                var stepIndex: number = 0;
                while (this.items.length > 0) {
                    tempItem = this.items[0];
                    this.removeItem(tempItem, false);

                    stepIndex++;
                    if (stepIndex >= maxStepsCount) {
                        Logger.log("SimpleList | commitItemsData", "WARNING! Max steps count reached!");
                        break;
                    }
                }
            }

            var reuseItemsToDataMap: Dictionary<ItemData, ItemType> = new Dictionary();
            var reuseDataItems: ItemType[] = [];
            if (this.reuseItemsForConcreteData) {
                itemsCount = this.dataProvider.length;
                for (itemIndex = 0; itemIndex < itemsCount; itemIndex++) {
                    tempData = this.dataProvider[itemIndex];
                    tempItem = this.getItemFromCacheToReuse(tempData);

                    if (tempItem) {
                        reuseDataItems.push(tempItem);
                        reuseItemsToDataMap.addItem(tempData, tempItem);
                    }
                }

                // Remove all items, which will be reused for specific data, from the cache
                // ArrayTools.removeItems(this.cacheItems, reuseDataItems);
            }

            // Creation of items
            for (itemIndex = 0; itemIndex < itemsCount; itemIndex++) {
                tempItem = null;
                tempData = this.dataProvider[itemIndex];

                // If cache should be used
                if (this.useItemsCache) {
                    // If reusing elements for specific data is turned on,
                    // try to find an item for specific data
                    if (this.reuseItemsForConcreteData) {
                        //tempItem = this.getItemFromCache(tempData, this.reuseItemsForConcreteData);
                        // tempItem = this.getItemFromCacheToReuse(tempData);
                        tempItem = reuseItemsToDataMap.getItem(tempData);
                        if (tempItem) {
                            reuseItemsToDataMap.removeItemByKey(tempData);
                        }
                    }

                    if (this.cacheItems.length > 0) {
                        // If a cached item for the specific data wasn't found,
                        // then try to get regular cached item
                        if (!tempItem) {
                            tempItem = this.getItemFromCache();
                        }
                    }
                }

                if (!tempItem) {
                    tempItem = new this.ItemRendererClass();
                }

                this.addItem(tempItem, itemIndex);
            }

            // Remove newly used items from the list of the previously used items
            ArrayTools.removeItems(prevItems, this.items);
            // Remove all previously used items (and add them to cache if allowed)
            itemsCount = prevItems.length;
            for (itemIndex = 0; itemIndex < itemsCount; itemIndex++) {
                tempItem = prevItems[itemIndex];

                this.removeItem(tempItem);
            }
        }

        if (this.items && this._itemsProperties) {
            for (const singleItem of this.items) {
                ObjectTools.copyProps(
                    singleItem,
                    this._itemsProperties
                );
            }
        }

        this.arrange();
    }

    protected addItem(item: ItemType, index: number): void {
        this.items[index] = item;

        this.applyDataToItem(item, this.dataProvider[index]);
        DisplayTools.safeAddChildAt(this, item, index);

        this.resizeSingleItem(item);
    }

    protected removeItem(item: ItemType, removeFromDisplayList: boolean = true): void {
        if (!item) {
            return;
        }

        if (removeFromDisplayList) {
            DisplayTools.childRemoveItselfFromParent(item);
        }
        ArrayTools.removeItem(this.items, item);

        if (this.useItemsCache) {
            this.addItemToCache(item);
        }
    }

    protected applyDataToItem(item: ItemType, itemData: any): void {
        if (!item) {
            return;
        }

        item[this.itemsDataPropertyName] = itemData;
    }

    protected removeAllItems(): void {
        DisplayTools.removeAllChildren(this);

        this.items = [];
        this.cacheItems = [];
    }


    layoutGetChildrenNum(): number {
        return this.items.length;
    }

    layoutGetChildAt(index: number): ItemType {
        return this.items[index];
    }

    public getItems(): ItemType[] {
        return this.items.concat();
    }

    protected childrenResizeSize: Point;
    public resizeItems(childrenWidth: number, childrenHeight: number): void {
        if (!this.childrenResizeSize) {
            this.childrenResizeSize = new Point();
        }

        if (this.childrenResizeSize.x === childrenWidth &&
            this.childrenResizeSize.y === childrenHeight) {
            return;
        }

        this.childrenResizeSize.x = childrenWidth;
        this.childrenResizeSize.y = childrenHeight;

        for (let singleItem of this.items) {
            this.resizeSingleItem(singleItem);
        }
    }

    protected resizeSingleItem(item: ItemType): void {
        if (!this.childrenResizeSize) {
            return;
        }

        const resizableItem: IResizable = (item as any);
        if (resizableItem.resize) {
            resizableItem.resize(this.childrenResizeSize.x, this.childrenResizeSize.y);

        } else {
            item.width = this.childrenResizeSize.x;
            item.height = this.childrenResizeSize.y;
        }
    }
}