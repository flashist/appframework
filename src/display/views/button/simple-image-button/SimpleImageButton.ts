import { DisplayTools, FContainer, Graphics, GraphicsTools, InteractiveEvent, Sprite } from "@flashist/flibs";
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
import { AppResizableContainer } from "../../resize";
import { IToggableItem } from "../../togglegroup";
import { SimpleButtonState } from "../SimpleButtonState";

export class SimpleImageButton<DataType extends object = object> extends AppResizableContainer<DataType> implements IToggableItem {

    public id: string;

    private _enabled: boolean;
    protected _state: string;
    protected _selected: boolean;

    protected config: SimpleImageButtonConfig;

    protected contentCont: FContainer;
    protected transpBg: Graphics;
    protected image: Sprite;

    protected lastProcessedState: string;

    private _lockState: boolean;

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

        this.transpBg = GraphicsTools.createTraspRect(0, 0, 10, 10);
        this.contentCont.addChild(this.transpBg);

        this.state = SimpleImageButtonState.NORMAL;
        this.enabled = true;
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
        this.onOut();
        // this.onOver();
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
            this.cursor = "pointer";

        } else {
            this.interactive = false;
            this.cursor = null;
        }

        if (!this.lockState) {
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
                this.cursor = "pointer";

            } else {
                this.interactive = false;
                this.cursor = null;
            }

            this.lastProcessedState = tempConfigState;
        }

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        if (this.image) {
            this.transpBg.width = this.image.width;
            this.transpBg.height = this.image.height;

        } else {
            this.transpBg.width = 1;
            this.transpBg.height = 1;
        }
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

    public get lockState(): boolean {
        return this._lockState;
    }

    public set lockState(value: boolean) {
        if (value === this._lockState) {
            return;
        }

        this._lockState = value;

        this.commitData();
    }
}