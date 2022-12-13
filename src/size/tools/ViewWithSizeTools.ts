import { Rectangle } from "pixi.js";
import { IViewWithSizeArea } from "../views/IViewWithSizeArea";

export class ViewWithSizeTools {
    static getSize(view: IViewWithSizeArea, result?: Rectangle): Rectangle {

        if (!result) {
            result = new Rectangle();
        }
        
        if (view.sizeArea) {
            result.x = view.x + view.sizeArea.x * view.scale.x;
            result.y = view.y + view.sizeArea.y * view.scale.y;
            //
            result.width = result.x + view.sizeArea.width * view.scale.x;
            result.height = result.y + view.sizeArea.height * view.scale.y;

        } else {
            view.getBounds(false, result);
        }

        return result;
    }
}