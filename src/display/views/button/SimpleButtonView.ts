import { FContainer, FLabel, Texture, InteractiveEvent, Sprite, DisplayResizeTools, Graphics, DisplayObjectContainer } from "@flashist/flibs";

import { SimpleButtonConfig, ISingleButtonStateConfig, SimpleButtonDefaultConfig } from "./SimpleButtonConfig";
import { SimpleButtonState } from "./SimpleButtonState";
import { AppResizableContainer } from "../resize/AppResizableContainer";
import { IToggableItem } from "../togglegroup/IToggableItem";
import { ObjectTools } from '@flashist/fcore';
import { BaseLayout, BaseLayoutableContainer } from "../layout";

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

    // protected _bgAlpha: number;
    // protected _bgColor: number;
    // protected _bgLineWidth: number;
    // protected _bgLineColor: number;
    // protected _bgLineAlpha: number;
    // protected _bgCornerRadius: number;
    // protected _contentToBgPaddingX: number;
    // protected _contentToBgPaddingY: number;

    protected bg: Graphics;
    protected contentCont: FContainer;
    protected layoutableCont: BaseLayoutableContainer;
    protected icon: Sprite;
    // protected bg: Graphics | Sprite;
    public label: FLabel;
    protected viewCont: FContainer;

    protected _contentLayout: BaseLayout;

    constructor(config: SimpleButtonConfig) {
        super(config);
    }

    protected construction(config: SimpleButtonConfig): void {
        super.construction();
        // First "write" default values
        this.config = ObjectTools.clone(SimpleButtonDefaultConfig);
        // Then override them with passed config
        ObjectTools.copyProps(this.config, config);

        // this._bgAlpha = 0;
        // this._bgColor = 0x000000;
        // this._bgLineWidth = 0;
        // this._bgLineColor = 0x000000;
        // this._bgLineAlpha = 0;
        // this._bgCornerRadius = 0;
        // this._contentToBgPaddingX = 0;
        // this._contentToBgPaddingY = 0;
        // this.bg = this.createBg();
        // this.contentCont.addChild(this.bg);

        this.bg = new Graphics();
        this.addChild(this.bg);

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);

        this.viewCont = new FContainer();
        this.contentCont.addChild(this.viewCont);

        this.layoutableCont = new BaseLayoutableContainer();
        this.contentCont.addChild(this.layoutableCont);

        this.icon = new Sprite();
        this.layoutableCont.addChild(this.icon);

        this.label = new FLabel(this.config.labelConfig);
        this.layoutableCont.addChild(this.label);
        //
        // this.label.interactive = true;
        // this.label.interactiveChildren = true;

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
        this.onOut();
    }

    protected arrange(): void {
        super.arrange();

        if (this.contentLayout) {
            this.contentLayout.arrange(this.layoutableCont);
        }

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


        this.updateBg();

        this.contentCont.x = this.bg.x + Math.floor((this.bg.width - this.contentCont.width) / 2) + this.config.bgConfig.contentToBgShiftX;
        this.contentCont.y = this.bg.y + Math.floor((this.bg.height - this.contentCont.height) / 2) + this.config.bgConfig.contentToBgShiftY;
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

        if (tempConfig.labelConfig) {
            this.label.changeConfig(tempConfig.labelConfig);
        }

        if (this.enabled) {
            this.interactive = true;
            this.cursor = "pointer";

        } else {
            this.interactive = false;
            this.cursor = null;
        }

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

    public addExternalView(view: DisplayObjectContainer): void {
        this.viewCont.addChild(view);

        this.arrange();
    }

    private updateBg(): void {
        this.bg.clear();
        this.bg.beginFill(this.config.bgConfig.bgColor, this.config.bgConfig.bgAlpha);
        this.bg.lineStyle(this.config.bgConfig.bgLineWidth, this.config.bgConfig.bgLineColor, this.config.bgConfig.bgLineAlpha, 0);

        this.bg.drawRoundedRect(0, 0, this.contentCont.width + this.config.bgConfig.contentToBgPaddingX * 2, this.contentCont.height + this.config.bgConfig.contentToBgPaddingY * 2, this.config.bgConfig.bgCornerRadius);

        this.bg.endFill();
    }


    public get contentLayout(): BaseLayout {
        return this._contentLayout;
    }
    public set contentLayout(value: BaseLayout) {
        this._contentLayout = value;

        this.arrange();
    }

    // public get bgLineWidth(): number {
    //     return this._bgLineWidth;
    // }
    // public set bgLineWidth(value: number) {
    //     if (value === this.bgLineWidth) {
    //         return;
    //     }

    //     this._bgLineWidth = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get bgLineColor(): number {
    //     return this._bgLineColor;
    // }
    // public set bgLineColor(value: number) {
    //     if (value === this.bgLineColor) {
    //         return;
    //     }

    //     this._bgLineColor = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get bgLineAlpha(): number {
    //     return this._bgLineAlpha;
    // }
    // public set bgLineAlpha(value: number) {
    //     if (value === this.bgLineColor) {
    //         return;
    //     }

    //     this._bgLineAlpha = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get bgCornerRadius(): number {
    //     return this._bgCornerRadius;
    // }
    // public set bgCornerRadius(value: number) {
    //     if (value === this.bgCornerRadius) {
    //         return;
    //     }

    //     this._bgCornerRadius = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get bgAlpha(): number {
    //     return this._bgAlpha;
    // }
    // public set bgAlpha(value: number) {
    //     if (value === this.bgAlpha) {
    //         return;
    //     }

    //     this._bgAlpha = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get bgColor(): number {
    //     return this._bgColor;
    // }
    // public set bgColor(value: number) {
    //     if (value === this.bgColor) {
    //         return;
    //     }

    //     this._bgColor = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get contentToBgPaddingX(): number {
    //     return this._contentToBgPaddingX;
    // }
    // public set contentToBgPaddingX(value: number) {
    //     if (value === this.contentToBgPaddingX) {
    //         return;
    //     }

    //     this._contentToBgPaddingX = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    // public get contentToBgPaddingY(): number {
    //     return this._contentToBgPaddingY;
    // }
    // public set contentToBgPaddingY(value: number) {
    //     if (value === this.contentToBgPaddingY) {
    //         return;
    //     }

    //     this._contentToBgPaddingY = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

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