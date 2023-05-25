import { FContainer, FLabel, Texture, InteractiveEvent, Sprite, DisplayResizeTools } from "@flashist/flibs";

import { SimpleButtonConfig, ISingleButtonStateConfig, SimpleButtonDefaultConfig } from "./SimpleButtonConfig";
import { SimpleButtonState } from "./SimpleButtonState";
import { AppResizableContainer } from "../resize/AppResizableContainer";
import { IToggableItem } from "../togglegroup/IToggableItem";
import { ObjectTools } from '@flashist/fcore';

export class SimpleButtonView<DataType extends object = object> extends AppResizableContainer<DataType> implements IToggableItem {

    public static NORMAL_TO_SELECTED_MAP = ((): any => {
        let result = {};
        result[SimpleButtonState.NORMAL] = SimpleButtonState.SELECTED_NORMAL;
        result[SimpleButtonState.OVER] = SimpleButtonState.SELECTED_OVER;
        result[SimpleButtonState.PRESS] = SimpleButtonState.SELECTED_PRESS;
        result[SimpleButtonState.DISABLED] = SimpleButtonState.SELECTED_DISABLED;

        return result;
    })();

    public static SELECTED_TO_NORMAL_MAP = ((): any => {
        let result = {};
        result[SimpleButtonState.SELECTED_NORMAL] = SimpleButtonState.NORMAL;
        result[SimpleButtonState.SELECTED_OVER] = SimpleButtonState.OVER;
        result[SimpleButtonState.SELECTED_PRESS] = SimpleButtonState.PRESS;
        result[SimpleButtonState.SELECTED_DISABLED] = SimpleButtonState.DISABLED;

        return result;
    })();

    public id: string;

    protected _enabled: boolean;
    protected _state: string;
    protected _selected: boolean;

    protected config: SimpleButtonConfig;

    protected contentCont: FContainer;
    protected icon: Sprite;
    // protected bg: Graphics | Sprite;
    protected label: FLabel;

    constructor(config: SimpleButtonConfig) {
        super(config);
    }

    protected construction(config: SimpleButtonConfig): void {
        super.construction();
        // First "write" default values
        this.config = ObjectTools.clone(SimpleButtonDefaultConfig);
        // Then override them with passed config
        ObjectTools.copyProps(this.config, config);

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);

        // this.bg = this.createBg();
        // this.contentCont.addChild(this.bg);

        this.icon = new Sprite();
        this.contentCont.addChild(this.icon);

        this.label = new FLabel(this.config.labelConfig);
        this.contentCont.addChild(this.label);
        //
        this.label.interactive = true;
        this.label.interactiveChildren = true;

        this.state = SimpleButtonState.NORMAL;
        this.enabled = true;

        // if (!this.config.bgConfig?.resizeBg) {
        //     this.resize(
        //         this.bg.width,
        //         this.bg.height
        //     );
        // }
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
            InteractiveEvent.DOWN,
            this.onDown
        );
        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.UP,
            this.onUp
        );
        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.TAP,
            this.onTap
        );
        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.UP_OUTSIDE,
            this.onUpOutside
        );
    }

    protected onUpOutside(): void {
        this.state = this.findStateValue(SimpleButtonState.NORMAL);
    }

    protected onOver(): void {
        // this.contentCont.alpha = 1;
        this.state = this.findStateValue(SimpleButtonState.OVER);
    }

    protected onOut(): void {
        // this.contentCont.alpha = 0.75;
        this.state = this.findStateValue(SimpleButtonState.NORMAL);
    }

    protected onDown(): void {
        this.state = this.findStateValue(SimpleButtonState.PRESS);
    }

    protected onUp(): void {
        this.state = this.findStateValue(SimpleButtonState.OVER);
    }

    protected onTap(): void {
        // this.onOut();
    }

    protected arrange(): void {
        super.arrange();

        if (this.resizeSize.x && this.resizeSize.y) {
            this.contentCont.scale.set(1);
            const tempScale: number = DisplayResizeTools.getScale(
                this.contentCont.width,
                this.contentCont.height,
                this.resizeSize.x,
                this.resizeSize.y
            );
            this.contentCont.scale.set(tempScale);
        }

        // if (this.config.bgConfig?.resizeBg) {
        //     if (this.bg.width !== this.resizeSize.x ||
        //         this.bg.height !== this.resizeSize.y) {

        //         this.updateBg();
        //     }
        // }

        // this.label.width = this.bg.width;
        // this.label.height = this.bg.height;
        // this.label.x = this.bg.x + Math.floor((this.bg.width - this.label.width) / 2);
        // this.label.y = this.bg.y + Math.floor((this.bg.height - this.label.height) / 2);
    }

    get enabled(): boolean {
        return this._enabled;
    }
    set enabled(value: boolean) {
        if (value === this._enabled) {
            return;
        }

        this._enabled = value;

        if (this._enabled) {
            this.state = this.findStateValue(SimpleButtonState.NORMAL);
        } else {
            this.state = this.findStateValue(SimpleButtonState.DISABLED);
        }

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

        let tempConfigState: string = this.state;
        if (!this.config.states[tempConfigState]) {
            if (this.selected) {
                tempConfigState = SimpleButtonView.SELECTED_TO_NORMAL_MAP[this.state];
            }
        }

        if (!this.config.states[tempConfigState]) {
            tempConfigState = SimpleButtonState.NORMAL;
        }

        let tempConfig: ISingleButtonStateConfig = this.config.states[tempConfigState];
        if (tempConfig.alpha || tempConfig.alpha === 0) {
            this.alpha = tempConfig.alpha;
        }

        if (tempConfig.icon) {
            this.icon.texture = Texture.from(tempConfig.icon);
        }

        if (this.enabled) {
            this.interactive = true;
            this.cursor = "pointer";

        } else {
            this.interactive = false;
            this.cursor = null;
        }

        // this.updateBg();
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
            result = SimpleButtonView.NORMAL_TO_SELECTED_MAP[normalState];
        }

        if (!result) {
            result = normalState;
        }

        return result;
    }

    // protected createBg(): Sprite | Graphics {
    //     let result: Sprite | Graphics;
    //     if (this.config.bgConfig?.image) {
    //         result = Sprite.from(this.config.bgConfig.image.imageId);

    //     } else {
    //         result = new Graphics();
    //     }

    //     return result;
    // }

    // protected updateBg(): void {
    //     if (this.config.bgConfig?.image) {
    //         if (this.config.bgConfig.resizeBg) {
    //             this.bg.width = this.resizeSize.x;
    //             this.bg.height = this.resizeSize.y;
    //         }

    //     } else if (this.config.bgConfig?.vector) {
    //         const vectorBg: Graphics = this.bg as Graphics;

    //         vectorBg.clear();
    //         let bgColor: number = this.config.bgConfig.vector.bgColor;
    //         if (this.state === SimpleButtonState.SELECTED_NORMAL || this.state === SimpleButtonState.OVER || this.state === SimpleButtonState.SELECTED_OVER) {
    //             bgColor = this.config.bgConfig.vector.overBgColor;
    //         }

    //         vectorBg.beginFill(bgColor, this.config.bgConfig.vector.bgAlpha);
    //         vectorBg.lineStyle(
    //             this.config.bgConfig.vector.bgBorderWidth,
    //             this.config.bgConfig.vector.bgBorderColor,
    //             this.config.bgConfig.vector.bgBorderAlpha,
    //             0
    //         );
    //         vectorBg.drawRect(0, 0, this.resizeSize.x, this.resizeSize.y);
    //         vectorBg.endFill();
    //     }
    // }
}