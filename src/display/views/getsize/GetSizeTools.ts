import {DisplayObjectContainer, Point} from "@flashist/flibs";
import {IGetSizeObject} from "./IGetSizeObject";

export class GetSizeTools {

    /**
     * Получение размера объекта.
     *
     * @param    sourceObject
     *
     * @return
     */
    static getObjectSize(sourceObject: DisplayObjectContainer): Point {
        let result: Point = new Point();

        let getSizeObject: IGetSizeObject = (sourceObject as any as IGetSizeObject);
        if (getSizeObject.getSize) {
            result = getSizeObject.getSize();

        } else {
            if (sourceObject.width) {
                result.x = sourceObject.width;
            }
            if (sourceObject.height) {
                result.y = sourceObject.height;
            }
        }

        return result;
    }

}