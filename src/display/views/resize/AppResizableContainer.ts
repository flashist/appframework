import { Graphics, DisplayTools, Point } from "@flashist/flibs";
import { AppContainer } from "../AppContainer";
import { IResizable } from "./IResizable";

export class AppResizableContainer<DataType extends any = any> extends AppContainer<DataType> implements IResizable {

    private _resizeSize: Point;

    private debugResizeSizeView: Graphics;
    private _debugResizeActive: boolean;
    public get debugResizeActive(): boolean {
        return this._debugResizeActive;
    }
    public set debugResizeActive(value: boolean) {
        if (value === this.debugResizeActive) {
            return;
        }

        this._debugResizeActive = value;

        if (this._debugResizeActive) {
            if (!this.debugResizeSizeView) {
                this.debugResizeSizeView = new Graphics();
                this.addChildAt(this.debugResizeSizeView, 0);
                //
                this.debugResizeSizeView.rect(0, 0, 10, 10);
                this.debugResizeSizeView.fill({ color: 0xFF0000, alpha: 0.25 });
            }

        } else {
            if (this.debugResizeSizeView) {
                DisplayTools.childRemoveItselfFromParent(this.debugResizeSizeView);
                this.debugResizeSizeView = null;
            }
        }

        this.arrange();
    }

    protected construction(...args): void {
        super.construction(...args);

        this._resizeSize = new Point();
    }

    public resize(width: number, height: number): void {
        this.resizeSize.x = width;
        this.resizeSize.y = height;

        if (this.isConstructed) {
            this.arrange();
        }
    }

    public get resizeSize(): Point {
        return this._resizeSize;
    }

    protected arrange(): void {
        super.arrange();

        if (this.debugResizeActive) {
            this.debugResizeSizeView.width = this.resizeSize.x;
            this.debugResizeSizeView.height = this.resizeSize.y;
        }
    }
    // public set resizeSize(value: Point) {
    //     throw new Error("Resize size should be changed through the resize method!");
    // }
}