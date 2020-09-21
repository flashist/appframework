import {VAlign, Align, Point} from "@flashist/flibs";

import {LayoutConfig} from "./LayoutConfig";
import {ILayoutableContainer} from "./container/ILayoutableContainer";

import {ILayoutableChild} from "./container/ILayoutableChild";
import {GetSizeTools} from "../../tools/GetSizeTools";

/**
 * ...
 * @author Mark (ruFlashist@gmail.com)
 */
export abstract class BaseLayout {
    protected settings: LayoutConfig;
    protected _totalSize: Point = new Point();

    constructor(settings?: Partial<LayoutConfig>) {

        this.settings = new LayoutConfig();
        if (settings) {
            (Object as any).assign(this.settings, settings);
        }
    }

    public abstract arrange(container: ILayoutableContainer): void;

    public getMaxChildSize(container: ILayoutableContainer): Point {
        var result: Point = new Point();


        var childrenCount: number = container.layoutGetChildrenNum();

        var tempChild: ILayoutableChild;
        var tempChildSize: Point;

        for (var childIndex: number = 0; childIndex < childrenCount; childIndex++) {
            tempChild = container.layoutGetChildAt(childIndex);

            tempChildSize = GetSizeTools.getObjectSize(tempChild);

            if (tempChildSize.x > result.x) {
                result.x = tempChildSize.x;
            }
            if (tempChildSize.y > result.y) {
                result.y = tempChildSize.y;
            }
        }


        return result;
    }

    protected arrangeChild(child: ILayoutableChild,
                           prevChild: ILayoutableChild,
                           align: String,
                           valign: String,
                           childMaxSize: Point,
                           columnIndex: number = 0,
                           rowIndex: number = 0,
                           cellShift: Point = null): void {

        var tempChildSize: Point = GetSizeTools.getObjectSize(child);

        var newChildPos: Point = new Point();

        newChildPos.x = this.settings.paddingX + (childMaxSize.x + this.settings.spacingX) * columnIndex;
        switch (align) {
            case Align.CENTER:
                newChildPos.x += ((childMaxSize.x - tempChildSize.x) / 2);
                break;

            case Align.RIGHT:
                newChildPos.x += childMaxSize.x - tempChildSize.x;
                break;
        }

        newChildPos.y = this.settings.paddingY + (childMaxSize.y + this.settings.paddingY) * rowIndex;
        switch (valign) {
            case VAlign.MIDDLE:
                newChildPos.y += ((childMaxSize.y - tempChildSize.y) / 2);
                break;

            case VAlign.BOTTOM:
                newChildPos.y += childMaxSize.y - tempChildSize.y;
                break;
        }


        if (cellShift) {
            newChildPos.x += cellShift.x;
            newChildPos.y += cellShift.y;
        }

        this.applyChildPosition(child, newChildPos.x, newChildPos.y);
    }

    protected applyChildPosition(child: ILayoutableChild, x: number, y: number): void {
        if (this.settings.isNeedFloorCoordinates) {
            x = Math.floor(x);
            y = Math.floor(y);
        }

        child.x = x;
        child.y = y;
    }

    public abstract findRealRowsAndColumnsCount(container: ILayoutableContainer): Point;

    public findFullColumnsAndRowsInSize(container: ILayoutableContainer, size: Point): Point {
        var result: Point = new Point();

        var tempSize: Point;
        var childsCount: number = container.layoutGetChildrenNum();
        for (var columnIndex: number = 1; columnIndex <= childsCount; columnIndex++) {
            tempSize = this.getTotalSizeForRowsAndColumns(container, columnIndex, 1);

            if (tempSize.x <= size.x) {
                result.x = columnIndex;

            } else {
                break;
            }
        }

        for (var rowIndex: number = 1; rowIndex <= childsCount; rowIndex++) {
            tempSize = this.getTotalSizeForRowsAndColumns(container, 1, rowIndex);

            if (tempSize.y <= size.y) {
                result.y = rowIndex;

            } else {
                break;
            }
        }


        return result;
    }

    protected getTotalSizeForRowsAndColumns(container: ILayoutableContainer, columnsCount: number, rowsCount: number): Point {
        var result: Point = new Point();

        var maxChildSize: Point = this.getMaxChildSize(container);
        result.x = this.settings.paddingX * 2 + maxChildSize.x * columnsCount + (this.settings.spacingY * (columnsCount - 1));
        result.y = this.settings.paddingY * 2 + maxChildSize.y * rowsCount + (this.settings.spacingX * (rowsCount - 1));

        return result;
    }

    protected updateTotalSize(container: ILayoutableContainer): void {
        var realRowsAndColumnsCount: Point = this.findRealRowsAndColumnsCount(container);
        var newTotalSize: Point = this.getTotalSizeForRowsAndColumns(container, realRowsAndColumnsCount.x, realRowsAndColumnsCount.y);

        this._totalSize = newTotalSize;
    }

    public getTotalSize(): Point {
        return this._totalSize;
    }
}