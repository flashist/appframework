import { Logger } from "@flashist/fcore";
import { Point } from "@flashist/flibs";
import { MultiColumnLayoutConfig } from "./MultiColumnLayoutConfig";
import { BaseLayout } from "./BaseLayout";
import { ILayoutableChild, ILayoutableContainer } from "./container";

/**
 * ...
 * @author Mark (ruFlashist@gmail.com)
 */
export class MultiColumnLayout extends BaseLayout {

    public settings: MultiColumnLayoutConfig;

    constructor(settings: Partial<MultiColumnLayoutConfig>) {
        super(settings);
    }

    public arrange(container: ILayoutableContainer): void {

        if (!container) {
            Logger.log("ColumnLayout | arrange", "WARNING! Can't find container!");
            return;
        }

        var tempChild: ILayoutableChild;
        var childMaxSize: Point = this.getMaxChildSize(container);

        var prevChild: ILayoutableChild;
        var childrenCount: number = container.layoutGetChildrenNum();
        for (var childIndex: number = 0; childIndex < childrenCount; childIndex++) {
            tempChild = container.layoutGetChildAt(childIndex);

            let colIndex: number = childIndex % this.settings.columnsCount;
            let rowIndex: number = Math.floor(childIndex / this.settings.columnsCount);

            this.arrangeChild(tempChild, prevChild, this.settings.align, this.settings.valign, childMaxSize, colIndex, rowIndex);

            prevChild = tempChild;
        }


        this.updateTotalSize(container);
    }

    public findRealRowsAndColumnsCount(container: ILayoutableContainer): Point {
        var result: Point = new Point();

        var childrenCount: number = container.layoutGetChildrenNum();
        result.x = this.settings.columnsCount;
        result.y = childrenCount % this.settings.columnsCount;

        return result;
    }
}