import {Point, DisplayObjectContainer} from "@flashist/flibs";
import {IGetSizable} from "../data/IGetSizable";

export class GetSizeTools {

    static getObjectSize(sourceObject: DisplayObjectContainer): Point {
        let result: Point = new Point();

        let getSizeObject: IGetSizable = (sourceObject as any as IGetSizable);
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