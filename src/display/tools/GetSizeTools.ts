import { DisplayObjectContainer, Point } from "@flashist/flibs";
import { IGetSizable } from "../data/IGetSizable";

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

    public getMaxChildSize(container: DisplayObjectContainer): Point {
        var result: Point = new Point();


        var childrenCount: number = container.children.length;

        var tempChild: DisplayObjectContainer;
        var tempChildSize: Point;

        for (var childIndex: number = 0; childIndex < childrenCount; childIndex++) {
            tempChild = container.getChildAt(childIndex);

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

}