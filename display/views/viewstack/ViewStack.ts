import {
    AssociativeArray,
    IDatable
} from "@flashist/fcore";

import {
    DisplayObject,
    DisplayObjectContainer
} from "@flashist/flibs";

import {IResizable} from "../resize/IResizable";
import {ResizableContainer} from "../resize/ResizableContainer";

export class ViewStack<StackViewType extends DisplayObjectContainer = DisplayObjectContainer> extends ResizableContainer implements IResizable {

    protected viewToIdMap: AssociativeArray<StackViewType>;

    protected _selectedId: string;
    protected _selectedItem: StackViewType;

    construction(...args): void {
        super.construction(...args);

        this.viewToIdMap = new AssociativeArray<StackViewType>();
    }

    public addView(view: StackViewType, id: string): void {
        this.viewToIdMap.push(view, id);
    }

    public removeView(view: StackViewType): void {
        this.viewToIdMap.remove(view);
    }


    public get selectedId(): string {
        return this._selectedId;
    }

    public set selectedId(value: string) {
        if (value == this.selectedId) {
            return;
        }

        // Remove the previous view
        if (this.selectedItem) {
            this.selectedItem.parent.removeChild(this._selectedItem);
            this._selectedItem = null;
        }

        this._selectedId = value;
        this._selectedItem = this.getViewById(this.selectedId);
        if (this.selectedItem) {
            this.addChild(this.selectedItem);
        }

        this.commitData();
        this.arrange();
    }

    protected getViewById(id: string): StackViewType {
        return this.viewToIdMap.getItem(id)
    }

    public get selectedItem(): StackViewType {
        return this._selectedItem;
    }

    protected commitData(): void {
        super.commitData();

        if (this.selectedItem) {
            const selectedDatableItem: IDatable = this._selectedItem as any;
            selectedDatableItem.data = this.data;
        }
    }

    protected arrange(): void {
        super.arrange();

        if (this._selectedItem) {
            if (this.resizeSize && this.resizeSize.x !== 0 && this.resizeSize.y !== 0) {
                const selectedResizableItem: IResizable = this._selectedItem as any;
                if (selectedResizableItem.resize) {
                    selectedResizableItem.resize(this.resizeSize.x, this.resizeSize.y);

                } else {
                    this._selectedItem.width = this.resizeSize.x;
                    this._selectedItem.height = this.resizeSize.y;
                }
            }
        }
    }
}