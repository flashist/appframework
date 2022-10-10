import { BaseObject, EventListenerHelper, IDefaultEventDispatcher } from "@flashist/fcore";

import { DisplayObject, InteractiveEvent } from "@flashist/flibs";

import { BaseBtnState } from "./BaseBtnState";
import { BaseBtnEvent } from "./BaseBtnEvent";

export class BaseBtn extends BaseObject {

    protected interactiveEventHelper: EventListenerHelper;

    // ToDo: the previous code worked with MovieClip implementation,
    // so this method might be moved to the MovieClip/Timeline-Button instead of the SimpleButton class
    /*protected static SELECTED_FRAMES_FIRST_PART:string = "selected_";
     protected static DISABLED_FRAME_NAME:string = "disabled";
     protected static HIT_AREA_CLIP_NAME:string = "customHitArea";
     protected static LABEL_FIELD_NAME:string = "labelField";*/

    protected _hitArea: DisplayObject;

    // protected label:BaseLabel;

    private _state: string;
    private _selected: boolean;

    public autoToggleSelected: boolean;

    private _enabled: boolean;


    protected construction(): void {
        super.construction();

        this.interactiveEventHelper = new EventListenerHelper(this);
        // this.label = new BaseLabel();

        this.state = BaseBtnState.NORMAL;
        this.enabled = true;
    }

    public destruction(): void {
        super.destruction();

        if (this.interactiveEventHelper) {
            this.interactiveEventHelper.destruction();
            this.interactiveEventHelper = null;
        }
    }

    protected removeListeners(): void {
        super.removeListeners();

        this.removeMouseListeners();
    }

    protected addMouseListeners(dispatcher: IDefaultEventDispatcher<any>): void {
        if (!dispatcher) {
            return;
        }

        this.removeMouseListeners();

        this.interactiveEventHelper.addEventListener(
            dispatcher,
            InteractiveEvent.OVER,
            this.onOver
        );

        this.interactiveEventHelper.addEventListener(
            dispatcher,
            InteractiveEvent.OUT,
            this.onOut
        );

        this.interactiveEventHelper.addEventListener(
            dispatcher,
            InteractiveEvent.DOWN,
            this.onMouseDown
        );

        this.interactiveEventHelper.addEventListener(
            dispatcher,
            InteractiveEvent.TAP,
            this.onTap
        );
    }

    protected removeMouseListeners(): void {
        if (!this.isConstructed) {
            return;
        }

        this.interactiveEventHelper.removeAllListeners();
    }


    protected onOver(): void {
        if (!this._enabled) {
            return;
        }

        this.state = this.findStateValue(BaseBtnState.OVER);

        this.redispatchEvent(InteractiveEvent.OVER);
    }

    protected onOut(): void {
        if (!this._enabled) {
            return;
        }

        this.state = this.findStateValue(BaseBtnState.NORMAL);

        this.redispatchEvent(InteractiveEvent.OUT);
    }

    protected onMouseDown(): void {
        if (!this._enabled) {
            return;
        }

        this.state = this.findStateValue(BaseBtnState.PRESS);

        this.redispatchEvent(InteractiveEvent.DOWN);
    }

    protected onTap(): void {
        if (!this._enabled) {
            return;
        }

        if (this.autoToggleSelected) {
            this.selected = !this.selected;
        }

        this.state = this.findStateValue(BaseBtnState.OVER);

        this.redispatchEvent(InteractiveEvent.TAP);
    }


    protected redispatchEvent(sourceEvent: string): void {
        this.dispatchEvent(sourceEvent);
    }

    protected commitStateData(): void {
        if (!this.isConstructed) {
            return;
        }

        this.commitEnabledData();
    }

    protected commitEnabledData(): void {
        if (this.hitArea) {
            if (this.enabled) {
                this.hitArea.interactive = true;
                this.hitArea.buttonMode = true;

            } else {
                this.hitArea.interactive = false;
                this.hitArea.buttonMode = false;
            }
        }
    }

    public get state(): string {
        return this._state;
    }
    public set state(value: string) {
        if (value == this.state) {
            return;
        }

        this._state = value;

        this.commitStateData();

        this.dispatchEvent(BaseBtnEvent.STATE_CHANGE);
    }

    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {
        if (value == this.selected) {
            return;
        }

        this._selected = value;

        if (this._selected) {
            this.state = BaseBtnState.SELECTED_NORMAL;
        } else {
            this.state = BaseBtnState.NORMAL;
        }

        this.dispatchEvent(BaseBtnEvent.SELECTED_CHANGE);
    }

    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        if (value == this.enabled) {
            return;
        }

        this._enabled = value;

        if (this._enabled) {
            this.state = this.findStateValue(BaseBtnState.NORMAL);
        } else {
            this.state = this.findStateValue(BaseBtnState.DISABLED);
        }

        this.commitEnabledData();
    }


    protected commitData(): void {
        super.commitData();

        if (!this.isConstructed) {
            return;
        }

        // this.updateHitArea();
        this.commitStateData();
    }


    public get hitArea(): DisplayObject {
        return this._hitArea;
    }
    public set hitArea(value: DisplayObject) {
        if (value == this.hitArea) {
            return;
        }

        // Remove previous hit area
        this.removeMouseListeners();

        // Set the new hit area
        this._hitArea = value;
        this.addMouseListeners(this.hitArea);

        this.commitData();
    }

    // protected updateHitArea():void {
    //     /*var tempNewHitArea:createjs.DisplayObject;
    //     if (this.view) {
    //         tempNewHitArea = (this.view[BaseBtn.HIT_AREA_CLIP_NAME] as createjs.DisplayObject);
    //         if (!tempNewHitArea) {
    //             tempNewHitArea = this.view;
    //         }
    //     }
    //
    //     this.hitArea = tempNewHitArea;*/
    //     // ToDo: the previous code worked with MovieClip implementation,
    //     // so this method might be moved to the MovieClip/Timeline-Button instead of the SimpleButton class
    // }

    /*protected updateLabel():void {
     // var tempNewField:createjs.Text;
     // if (this.view) {
     //     tempNewField = DisplayObjectTools.findChildByName<createjs.Text>(this.view, BaseBtn.LABEL_FIELD_NAME, true);
     // }
     //
     // this.label.field = tempNewField;
     // ToDo: the previous code worked with MovieClip implementation,
     // so this method might be moved to the MovieClip/Timeline-Button instead of the BaseBtn class
     }*/

    // Think whether we really need to have the label object in the BaseBtn class
    /*public get text():string {
     return this.label.text;
     }
     public set text(value:string) {
     this.label.text = value;
     }*/


    /*public simulateClick():void {
     if (this.enabled) {
     var tempEvent:createjs.MouseEvent = new createjs.MouseEvent(createjs.MouseEvent.CLICK);
     tempEvent.target = this;

     this.onTap(tempEvent);
     }
     }*/


    /*private _commitStateDataCallback: Function;
    get commitStateDataCallback(): Function {
        return this._commitStateDataCallback;
    }
    set commitStateDataCallback(value: Function) {
        if (value === this.commitStateDataCallback) {
            return;
        }

        this._commitStateDataCallback = value;

        this.commitStateData();
    }*/

    protected findStateValue(sourceState: string): string {
        let result: string;

        if (this.selected) {
            result = BaseBtnState.NORMAL_TO_SELECTED_MAP[sourceState];

        } else {
            result = BaseBtnState.SELECTED_TO_NORMAL_MAP[sourceState];
        }

        if (!result) {
            result = sourceState;
        }

        return result;
    }
}
