import {
    FContainer,
    Point
} from "@flashist/flibs";
import {IResizable} from "./IResizable";

export class ResizableContainer<DataType extends object = object> extends FContainer<DataType> implements IResizable {

    private _resizeSize: Point;
    private _maxSize: Point;
    private _minSize: Point;

    protected construction(...args): void {
        super.construction(...args);

        this._minSize = new Point();
        this._maxSize = new Point();
        this._resizeSize = new Point();
    }

    public resize(width: number, height: number): void {
        if (this._minSize.x) {
            width = Math.max(width, this._minSize.x)
        }
        if (this._maxSize.x) {
            width = Math.min(width, this._maxSize.x)
        }

        if (this._minSize.y) {
            height = Math.max(width, this._minSize.y)
        }
        if (this._maxSize.y) {
            height = Math.min(height, this._maxSize.y)
        }

        this.resizeSize.x = width;
        this.resizeSize.y = height;

        this.arrange();
    }

    get minSize(): Point {
        return this._minSize;
    }
    set minSize(value: Point) {
        if (!value) {
            return;
        }
        if (value.x === this._minSize.x && value.y === this._minSize.y) {
            return;
        }

        this._minSize = value.clone();

        this.resize(this.resizeSize.x, this.resizeSize.y);
    }

    get maxSize(): Point {
        return this._maxSize;
    }
    set maxSize(value: Point) {
        if (!value) {
            return;
        }
        if (value.x === this._maxSize.x && value.y === this._maxSize.y) {
            return;
        }

        this._maxSize = value.clone();

        this.resize(this.resizeSize.x, this.resizeSize.y);
    }

    public get resizeSize(): Point {
        return this._resizeSize;
    }
    public set resizeSize(value: Point) {
        throw new Error("Resize size should be changed through the resize method!");
    }
}