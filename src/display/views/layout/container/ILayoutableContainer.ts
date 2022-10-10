import {ILayoutableChild} from "./ILayoutableChild";

/**
 * ...
 * @author Mark (ruFlashist@gmail.com)
 */
export interface ILayoutableContainer<ChildrenType extends ILayoutableChild = ILayoutableChild> {

    /**
     * Получение количество дочерних объектов
     */
    layoutGetChildrenNum(): number;

    /**
     * Получение дочернего объекта по индексу
     */
    layoutGetChildAt(index: number): ChildrenType;
}