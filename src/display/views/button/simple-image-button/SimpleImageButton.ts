import { DisplayTools, FContainer, InteractiveEvent, Sprite } from "@flashist/flibs";
import { ObjectTools } from '@flashist/fcore';
import {
    ISimpleImageButtonStateVO,
    SimpleImageButtonConfig,
    SimpleImageButtonDefaultConfig
} from "./SimpleImageButtonConfig";
import {
    SimpleImageButtonState,
    SimpleImageButtonStateNormalToSelectedMap,
    SimpleImageButtonStateSelectedToNormalMap
} from "./SimpleImageButtonState";
import { ResizableContainer } from "../../resize";
import { IToggableItem } from "../../togglegroup";
import { SimpleButtonState } from "../SimpleButtonState";

export class SimpleImageButton<DataType extends object = object> extends ResizableContainer<DataType> implements IToggableItem {

    public id: string;

    private _enabled: boolean;
    protected _state: string;
    protected _selected: boolean;

    protected config: SimpleImageButtonConfig;

    protected contentCont: FContainer;
    // protected bg: Graphics | Sprite;
    // protected label: FLabel;
    protected image: Sprite;

    protected lastProcessedState: string;

    constructor(config: Partial<SimpleImageButtonConfig>) {
        super(config);
    }

    protected construction(config: Partial<SimpleImageButtonConfig>): void {
        super.construction();
        // First "write" default values
        this.config = ObjectTools.clone(SimpleImageButtonDefaultConfig);
        // Then override them with passed config
        ObjectTools.copyProps(this.config, config);

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);

        // this.bg = this.createBg();
        // this.contentCont.addChild(this.bg);

        // this.label = new FLabel(this.config.labelConfig);
        // this.contentCont.addChild(this.label);
        // //
        // this.label.interactive = true;
        // this.label.interactiveChildren = true;

        this.state = SimpleImageButtonState.NORMAL;
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
            InteractiveEvent.DOWN,
            this.onDown
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
        this.state = this.findStateValue(SimpleImageButtonState.OVER);
    }

    private onDown(): void {
        // this.contentCont.alpha = 1;
        this.state = this.findStateValue(SimpleImageButtonState.PRESS);
    }

    private onOut(): void {
        // this.contentCont.alpha = 0.75;
        this.state = this.findStateValue(SimpleImageButtonState.NORMAL);
    }

    protected onTap(): void {
        // this.onOut();
    }

    protected arrange(): void {
        super.arrange();

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

    // public get text(): string {
    //     return this.label.text;
    // }
    //
    // public set text(value: string) {
    //     this.label.text = value;
    //     this.arrange();
    // }

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
                tempConfigState = SimpleImageButtonStateSelectedToNormalMap[this.state];
            }
        }
        if (!this.config.states[tempConfigState]) {
            tempConfigState = this.findStateValue(SimpleImageButtonState.NORMAL);
        }

        let tempConfig: ISimpleImageButtonStateVO = this.config.states[tempConfigState];
        if (tempConfig.alpha || tempConfig.alpha === 0) {
            this.alpha = tempConfig.alpha;
        }
        if (tempConfig.imageId || tempConfig.imageId === "") {
            if (this.image) {
                DisplayTools.childRemoveItselfFromParent(this.image);
                this.image = null;
            }

            if (tempConfig.imageId) {
                this.image = Sprite.from(tempConfig.imageId);
                this.contentCont.addChild(this.image);
            }
        }

        if (this.enabled) {
            this.interactive = true;
            this.buttonMode = true;

        } else {
            this.interactive = false;
            this.buttonMode = false;
        }

        this.lastProcessedState = tempConfigState;

        // this.updateBg();
        this.arrange();
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        if (value == this.selected) {
            return;
        }

        this._selected = value;

        this.state = this.findStateValue(SimpleImageButtonState.NORMAL);
    }

    protected findStateValue(normalState: string): string {
        let result: string;

        if (this.enabled) {
            if (this.selected) {
                result = SimpleImageButtonStateNormalToSelectedMap[normalState];
            }

            if (!result) {
                result = normalState;
            }

        } else {
            result = SimpleButtonState.DISABLED;
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
    //         if (this.state === SimpleImageButtonState.SELECTED_NORMAL || this.state === SimpleImageButtonState.OVER || this.state === SimpleImageButtonState.SELECTED_OVER) {
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