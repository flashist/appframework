import { BaseLayout } from "./BaseLayout";
import { ILayoutableContainer } from "./container/ILayoutableContainer";
import { Logger } from "@flashist/fcore";
import { Point } from "@flashist/flibs";
import { GetSizeTools } from "../../tools/GetSizeTools";
import { ILayoutableChild } from "./container/ILayoutableChild";

export class AlignWithMaxSizeLayout extends BaseLayout {

    public arrange(container: ILayoutableContainer): void {

        if (!container) {
            Logger.log("AlignWithMaxSizeLayout | arrange", "WARNING! Can't find container!");
            return;
        }

        let tempChild: ILayoutableChild;
        let tempChildSize: Point;

        let childMaxSize: Point = this.getMaxChildSize(container);

        let prevChild: ILayoutableChild;
        //
        let childrenCount: number = container.layoutGetChildrenNum();
        for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
            tempChild = container.layoutGetChildAt(childIndex);

            tempChildSize = GetSizeTools.getObjectSize(tempChild);

            this.arrangeChild(tempChild, prevChild, this.settings.align, this.settings.valign, childMaxSize, 0, 0);

            prevChild = tempChild;
        }

        this.updateTotalSize(container);
    }

    protected getTotalSizeForRowsAndColumns(container: ILayoutableContainer, columnsCount: number, rowsCount: number): Point {
        let maxChildSize: Point = this.getMaxChildSize(container);
        let result: Point = new Point(maxChildSize.x, maxChildSize.y);

        return result;
    }

    public findRealRowsAndColumnsCount(container: ILayoutableContainer): Point {
        let result: Point = new Point(1, 1);
        return result;
    }
}