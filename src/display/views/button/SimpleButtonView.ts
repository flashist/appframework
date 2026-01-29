import { FContainer, FLabel, Texture, InteractiveEvent, Sprite, DisplayResizeTools, Graphics, DisplayObjectContainer, DisplayTools } from "@flashist/flibs";

import { SimpleButtonConfig, ISingleButtonSingleStateConfig, SimpleButtonDefaultConfig, ISimpleButtonBgConfig, ISimpleButtonStatesConfig } from "./SimpleButtonConfig";
import { SimpleButtonState } from "./SimpleButtonState";
import { AppResizableContainer } from "../resize/AppResizableContainer";
import { IToggableItem } from "../togglegroup/IToggableItem";
import { ObjectTools } from '@flashist/fcore';
import { BaseLayout, BaseLayoutableContainer } from "../../../index";

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
    protected curStateExternalView: DisplayObjectContainer;

    private _icon: Sprite;
    public get icon(): Sprite {
        return this._icon;
    }

    // protected bg: Graphics | Sprite;
    public fLabel: FLabel;
    // protected viewCont: FContainer;

    protected _contentLayout: BaseLayout;

    constructor(config: SimpleButtonConfig) {
        super(config);
    }

    protected construction(config: SimpleButtonConfig): void {
        super.construction();
        // First "write" default values
        this.config = ObjectTools.clone(SimpleButtonDefaultConfig);

        // Make sure we don't try to deep-copy some "complex" type properties
        const linkCopyConfig: SimpleButtonConfig = {
            defaultState: {},
            states: {}
        };

        if (config.defaultState) {
            if (config.defaultState.externalView) {
                // Save the "complex" type data, to be able to use it later
                linkCopyConfig.defaultState.externalView = config.defaultState.externalView

                // Temporarily remove the "complex" type data from the config
                // to correctly apply deep-copy algorythm
                delete config.defaultState.externalView;
            }
        }

        if (config.states) {
            const configStateIds: string[] = Object.keys(config.states);
            for (let singleStateId of configStateIds) {
                if (config.states[singleStateId].externalView) {
                    // Save the "complex" type data, to be able to use it later
                    linkCopyConfig.states[singleStateId] = {
                        externalView: config.states[singleStateId].externalView
                    };

                    // Temporarily remove the "complex" type data from the config
                    // to correctly apply deep-copy algorythm
                    delete config.states[singleStateId].externalView;
                }
            }
        }

        // Then override them with passed config
        ObjectTools.copyProps(this.config, config);

        if (config.defaultState) {
            // Set the link-based data of the "complex" link
            this.config.defaultState.externalView = linkCopyConfig.defaultState.externalView;
            // Return the data into the original config
            config.defaultState.externalView = linkCopyConfig.defaultState.externalView;
        }

        if (config.states) {
            // Return back all the deleted "complex" type properties to the original config
            // And use them in the final config
            const linkCopyConfigStateIds: string[] = Object.keys(config.states);
            for (let singleCopyStateId of linkCopyConfigStateIds) {
                if (linkCopyConfig.states[singleCopyStateId]?.externalView) {
                    // Set the link-based data of the "complex" link
                    this.config.states[singleCopyStateId].externalView = linkCopyConfig.states[singleCopyStateId].externalView;
                    // Return the data into the original config
                    config.states[singleCopyStateId].externalView = linkCopyConfig.states[singleCopyStateId].externalView;
                }
            }
        }

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

        // this.viewCont = new FContainer();
        // this.contentCont.addChild(this.viewCont);

        this.layoutableCont = new BaseLayoutableContainer();
        this.contentCont.addChild(this.layoutableCont);

        this.fLabel = new FLabel(this.config.defaultState.labelConfig);
        this.layoutableCont.addChild(this.fLabel);
        //
        this.fLabel.text = "";
        //
        // this.fLabel.interactive = true;
        // this.fLabel.interactiveChildren = true;

        this._icon = new Sprite();
        this.layoutableCont.addChild(this.icon);

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

    protected updateIcon(): void {
        let tempStateConfig: ISingleButtonSingleStateConfig = this.getCurrentActiveCombinedStateConfig();

        this.icon.texture = null;
        //
        if (tempStateConfig.iconConfig) {
            this.icon.texture = Texture.from(tempStateConfig.iconConfig.textureId);

            // Reset possible prev transformations
            this.icon.scale.x = 1;
            this.icon.scale.y = 1;

            //
            if (tempStateConfig.iconConfig.maxWidth) {
                this.icon.width = Math.max(this.icon.width, tempStateConfig.iconConfig.maxWidth)
            }
            if (tempStateConfig.iconConfig.maxHeight) {
                this.icon.height = Math.max(this.icon.height, tempStateConfig.iconConfig.maxHeight)
            }
            //
            if (tempStateConfig.iconConfig.scaleByWidth) {
                this.icon.scale.y = this.icon.scale.x;
            }
            if (tempStateConfig.iconConfig.scaleByHeight) {
                this.icon.scale.x = this.icon.scale.y;
            }
        }
    }

    protected arrange(): void {
        super.arrange();

        this.updateIcon();

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

        // this.contentCont.x = this.bg.x + Math.floor((this.bg.width - this.contentCont.width) / 2) + this.curConfig.bgConfig.contentToBgShiftX;
        // this.contentCont.y = this.bg.y + Math.floor((this.bg.height - this.contentCont.height) / 2) + this.curConfig.bgConfig.contentToBgShiftY;

        this.contentCont.x = this.bg.x + Math.floor((this.bgCalculatedWidth - this.contentCont.width) / 2);
        this.contentCont.y = this.bg.y + Math.floor((this.bgCalculatedHeight - this.contentCont.height) / 2);
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
        return this.fLabel.text;
    }
    public set text(value: string) {
        this.fLabel.text = value;
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

    protected getCurrentActiveState(): string {
        let result: string = this.state;
        if (!this.config.states[result]) {
            if (this.selected) {
                result = SimpleButtonView.SELECTED_TO_NORMAL_MAP[this.state];
            }
        }

        if (!this.config.states[result]) {
            result = SimpleButtonState.NORMAL;
        }

        return result;
    }

    protected getCurrentActiveStateConfig(): ISingleButtonSingleStateConfig {
        let tempState: string = this.getCurrentActiveState();

        let result: ISingleButtonSingleStateConfig = this.config.states[tempState];
        return result;
    }

    protected getCurrentActiveCombinedStateConfig(): ISingleButtonSingleStateConfig {
        let result: ISingleButtonSingleStateConfig = {};

        let tempDefaultWithoutExternalConfig: ISingleButtonSingleStateConfig = this.getCopyOfStateWithoutExternalView(this.config.defaultState);
        //
        ObjectTools.copyProps(result, tempDefaultWithoutExternalConfig);
        if (this.config.defaultState.externalView) {
            result.externalView = this.config.defaultState.externalView;
        }

        //
        let tempCurStateConfig: ISingleButtonSingleStateConfig = this.getCurrentActiveStateConfig();
        let tempCurStateWithoutExternal: ISingleButtonSingleStateConfig = this.getCopyOfStateWithoutExternalView(tempCurStateConfig);
        //
        ObjectTools.copyProps(result, tempCurStateWithoutExternal);
        if (tempCurStateWithoutExternal.externalView) {
            result.externalView = tempCurStateWithoutExternal.externalView;
        }

        return result;
    }

    protected getCopyOfStateWithoutExternalView(state: ISingleButtonSingleStateConfig): ISingleButtonSingleStateConfig {
        let result: ISingleButtonSingleStateConfig = {};

        // Make sure we don't try to deep-copy some "complex" type properties
        const linkCopyConfig: ISingleButtonSingleStateConfig = {
        };

        if (state.externalView) {
            // Save the "complex" type data, to be able to use it later
            linkCopyConfig.externalView = state.externalView

            // Temporarily remove the "complex" type data from the config
            // to correctly apply deep-copy algorythm
            delete state.externalView;
        }

        // Then override them with passed config
        ObjectTools.copyProps(result, state);

        if (linkCopyConfig.externalView) {
            // Return the data into the original config
            state.externalView = linkCopyConfig.externalView;
        }

        return result;
    }

    // protected getCurActiveCombinedBgConfig(): Partial<ISimpleButtonBgConfig> {
    //     let result: Partial<ISimpleButtonBgConfig> = {};

    //     if (this.config.bgConfig) {
    //         ObjectTools.copyProps(result, this.config.bgConfig);
    //     }

    //     let tempStateConfig: ISingleButtonStateConfig = this.getCurrentActiveStateConfig();
    //     if (tempStateConfig.bgConfig) {
    //         ObjectTools.copyProps(result, tempStateConfig.bgConfig);
    //     }

    //     return result;
    // }

    // protected getCurActiveCombinedIconConfig(): Partial<ISimpleButtonBgConfig> {
    //     let result: Partial<ISimpleButtonBgConfig> = {};

    //     if (this.config.bgConfig) {
    //         ObjectTools.copyProps(result, this.config.bgConfig);
    //     }

    //     let tempStateConfig: ISingleButtonStateConfig = this.getCurrentActiveStateConfig();
    //     if (tempStateConfig.bgConfig) {
    //         ObjectTools.copyProps(result, tempStateConfig.bgConfig);
    //     }

    //     return result;
    // }

    protected commitData(): void {
        super.commitData();

        let tempConfig: ISingleButtonSingleStateConfig = this.getCurrentActiveCombinedStateConfig();

        this.alpha = tempConfig.alpha;

        this.fLabel.changeConfig(tempConfig.labelConfig);

        if (tempConfig.externalView !== this.curStateExternalView) {
            DisplayTools.childRemoveItselfFromParent(this.curStateExternalView);
        }
        if (tempConfig.externalView) {
            this.contentCont.addChild(tempConfig.externalView);
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

    public addExternalView(view: DisplayObjectContainer, addAtIndex?: number): void {
        // this.viewCont.addChild(view);
        if (addAtIndex || addAtIndex === 0) {
            this.layoutableCont.addChildAt(view, addAtIndex);
        } else {
            this.layoutableCont.addChild(view);
        }

        this.arrange();
    }


    protected get bgCalculatedWidth(): number {
        return this.resizeSize.x || this.contentCont.width;
    }

    protected get bgCalculatedHeight(): number {
        return this.resizeSize.y || this.contentCont.height;
    }

    protected updateBg(): void {
        let tempStateConfig: ISingleButtonSingleStateConfig = this.getCurrentActiveCombinedStateConfig();

        this.bg.clear();
        //
        // this.bg.rect(0, 0, this.bgCalculatedWidth, this.bgCalculatedHeight);
        if (tempStateConfig.bgConfig) {
            this.bg.roundRect(0, 0, this.bgCalculatedWidth, this.bgCalculatedHeight, tempStateConfig.bgConfig.cornerRadius);
            this.bg.fill({ color: tempStateConfig.bgConfig.color, alpha: tempStateConfig.bgConfig.alpha });
            this.bg.stroke({ color: tempStateConfig.bgConfig.lineColor, alpha: tempStateConfig.bgConfig.lineAlpha, width: tempStateConfig.bgConfig.lineWidth, alignment: 1 })
        }
    }

    // OLD
    // protected updateBg(): void {
    //     // Temporarily disable (stopped working properly in pixi.js v8)
    //     return;

    //     this.bg.clear();

    //     this.bg.roundRect(0, 0, this.contentCont.width + this.config.bgConfig.contentToBgPaddingX * 2, this.contentCont.height + this.config.bgConfig.contentToBgPaddingY * 2, this.config.bgConfig.bgCornerRadius);
    //     this.bg.setStrokeStyle({ width: this.config.bgConfig.bgLineWidth, color: this.config.bgConfig.bgLineColor, alpha: this.config.bgConfig.bgLineAlpha, alignment: 0 });
    //     this.bg.fill({ color: this.config.bgConfig.bgColor, alpha: this.config.bgConfig.bgAlpha });

    //     // this.bg.endFill();
    // }


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