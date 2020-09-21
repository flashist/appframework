import {FContainer, FLabel, Graphics, InteractiveEvent, Point, Sprite} from "@flashist/flibs";

import {ISimpleButtonConfig} from "./ISimpleButtonConfig";
import {SimpleButtonState} from "./SimpleButtonState";
import {ResizableContainer} from "../resize/ResizableContainer";
import {IToggableItem} from "../togglegroup/IToggableItem";

export class SimpleButtonView<DataType extends object = object> extends ResizableContainer<DataType> implements IToggableItem {

    public id: string;

    private _enabled: boolean;
    protected _state: string;
    protected _selected: boolean;

    protected config: ISimpleButtonConfig;

    protected contentCont: FContainer;
    protected bg: Graphics | Sprite;
    protected label: FLabel;

    constructor(config: ISimpleButtonConfig) {
        super(config);
    }

    protected construction(config: ISimpleButtonConfig): void {
        super.construction();

        this.config = config;

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);

        this.bg = this.createBg();
        this.contentCont.addChild(this.bg);

        this.label = new FLabel(this.config.labelConfig);
        this.contentCont.addChild(this.label);
        //
        this.label.interactive = false;
        this.label.interactiveChildren = false;

        this.state = SimpleButtonState.NORMAL;
        this.enabled = true;

        if (!this.config.bgConfig.resizeBg) {
            this.resize(
                this.bg.width,
                this.bg.height
            );
        }
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.OVER,
            this.onOver
        );
        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.OUT,
            this.onOut
        );
        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.TAP,
            this.onTap
        );
        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.UP_OUTSIDE,
            this.onOut
        );
    }

    private onOver(): void {
        // this.contentCont.alpha = 1;
        this.state = this.findStateValue(SimpleButtonState.OVER);
    }

    private onOut(): void {
        // this.contentCont.alpha = 0.75;
        this.state = this.findStateValue(SimpleButtonState.NORMAL);
    }

    protected onTap(): void {
        // this.onOut();
    }

    protected arrange(): void {
        super.arrange();

        if (this.config.bgConfig.resizeBg) {
            if (this.bg.width !== this.resizeSize.x ||
                this.bg.height !== this.resizeSize.y) {

                this.updateBg();
            }
        }

        this.label.width = this.bg.width;
        this.label.height = this.bg.height;
        this.label.x = this.bg.x + Math.floor((this.bg.width - this.label.width) / 2);
        this.label.y = this.bg.y + Math.floor((this.bg.height - this.label.height) / 2);
    }

    get enabled(): boolean {
        return this._enabled;
    }
    set enabled(value: boolean) {
        if (value === this._enabled) {
            return;
        }

        this._enabled = value;

        this.commitData();
    }

    public get text(): string {
        return this.label.text;
    }
    public set text(value: string) {
        this.label.text = value;
        this.arrange();
    }

    public get state(): string {
        return this._state;
    }
    public set state(value: string) {
        if (value == this.state) {
            return;
        }

        this._state = value;

        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        if (this.enabled) {
            this.interactive = true;
            this.alpha = 1;

        } else {
            this.interactive = false;
            this.alpha = 0.5;
        }

        this.updateBg();
    }

    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {
        if (value == this.selected) {
            return;
        }

        this._selected = value;

        this.state = this.findStateValue(SimpleButtonState.NORMAL);
    }

    protected findStateValue(normalState: string): string {
        let result: string;

        if (this.selected) {
            result = SimpleButtonState.NORMAL_TO_SELECTED_MAP[normalState];
        }

        if (!result) {
            result = normalState;
        }

        return result;
    }

    protected createBg(): Sprite | Graphics {
        let result: Sprite | Graphics;
        if (this.config.bgConfig.image) {
            result = Sprite.from(this.config.bgConfig.image.imageId);

        } else {
            result = new Graphics();
        }

        return result;
    }

    protected updateBg(): void {
        if (this.config.bgConfig.image) {
            if (this.config.bgConfig.resizeBg) {
                this.bg.width = this.resizeSize.x;
                this.bg.height = this.resizeSize.y;
            }

        } else {
            const vectorBg: Graphics = this.bg as Graphics;

            vectorBg.clear();

            let bgColor: number = this.config.bgConfig.vector.bgColor;
            if (this.state === SimpleButtonState.SELECTED_NORMAL || this.state === SimpleButtonState.OVER || this.state === SimpleButtonState.SELECTED_OVER) {
                bgColor = this.config.bgConfig.vector.overBgColor;
            }

            vectorBg.beginFill(bgColor, this.config.bgConfig.vector.bgAlpha);
            vectorBg.lineStyle(
                this.config.bgConfig.vector.bgBorderWidth,
                this.config.bgConfig.vector.bgBorderColor,
                this.config.bgConfig.vector.bgBorderAlpha,
                0
            );
            vectorBg.drawRect(0, 0, this.resizeSize.x, this.resizeSize.y);
            vectorBg.endFill();
        }
    }
}