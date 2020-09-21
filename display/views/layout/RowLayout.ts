import {BaseLayout} from "./BaseLayout";
import {Logger} from "@flashist/fcore";
import {Point} from "@flashist/flibs";
import {ILayoutableContainer} from "./container/ILayoutableContainer";
import {ILayoutableChild} from "./container/ILayoutableChild";
import {GetSizeTools} from "../../tools/GetSizeTools";

export class RowLayout extends BaseLayout {

    /**
     * Расстановка элементов контейнера.
     *
     * @param    coutnainer
     */
    public arrange(container: ILayoutableContainer): void {
        if (!container) {
            Logger.log("ColumnLayout | arrange", "WARNING! Can't find container!");
            return;
        }

        var tempChild: ILayoutableChild;
        //var tempSizableChild:IGetSizeSprite;
        var tempChildSize: Point;


        var childMaxSize: Point = this.getMaxChildSize(container);

        //
        var prevChild: ILayoutableChild;
        var prevChildSize: Point;
        //
        var childrenCount: number = container.layoutGetChildrenNum();
        for (var childIndex: number = 0; childIndex < childrenCount; childIndex++) {
            tempChild = container.layoutGetChildAt(childIndex);

            tempChildSize = GetSizeTools.getObjectSize(tempChild);

            this.arrangeChild(tempChild, prevChild, this.settings.align, this.settings.valign, childMaxSize, childIndex);

            // Запоминаем данные о текущем элементе
            prevChild = tempChild;
            prevChildSize = tempChildSize;
        }


        this.updateTotalSize(container);
    }

    /**
     * Выравнивание объекта.
     *
     * @param    child
     * @param    align
     * @param    valign
     * @param    childMaxSize
     * @param    columnIndex
     * @param    rowIndex
     * @param    cellShift
     */
    protected arrangeChild(child: ILayoutableChild, prevChild: ILayoutableChild, align: String, valign: String, childMaxSize: Point, columnIndex: number = 0, rowIndex: number = 0, cellShift: Point = null): void {
        super.arrangeChild(child, prevChild, align, valign, childMaxSize, columnIndex, rowIndex, cellShift);

        // В однострочных/одностолбцовых расстановках объекты должны расстанавливаться друг от дуга
        // не в зависимости от максимального размера, а в зависимости от взаимного размера ближайших объектов
        if (prevChild) {
            var prevChildSize: Point = GetSizeTools.getObjectSize(prevChild);
            //child.y = prevChild.y + prevChildSize.y + this.settings.spacing.y;

            this.applyChildPosition(
                child,
                prevChild.x + prevChildSize.x + this.settings.spacingX,
                child.y
            );
        }
    }

    /**
     * Обновление общего размера расстановки.
     *
     * @param    container
     */
    protected updateTotalSize(container: ILayoutableContainer): void {
        super.updateTotalSize(container);

        // В однострочных/одностолбцовых расстановках общий размер по одной из сторон должен рассчитываться
        // не на основе максимального размера, а на положения и размера последнего элемента
        var childrenCount: number = container.layoutGetChildrenNum();
        if (childrenCount > 0) {
            var lastChild: ILayoutableChild = container.layoutGetChildAt(childrenCount - 1);
            if (lastChild) {
                var lastChildSize: Point = GetSizeTools.getObjectSize(lastChild);
                this._totalSize.x = lastChild.x + lastChildSize.x + this.settings.paddingX;
            }
        }
    }


    /**
     * Получение количества строк и столбцов.
     *
     * @param    container
     *
     * @return
     */
    public findRealRowsAndColumnsCount(container: ILayoutableContainer): Point {
        var result: Point = new Point();

        var childrenCount: number = container.layoutGetChildrenNum();
        result.x = childrenCount;
        result.y = 1;

        return result;
    }

}