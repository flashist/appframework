import { ObjectTools } from "@flashist/fcore";

import { DisplayResizeTools, FContainer, Graphics, Point, Sprite, Texture } from "@flashist/flibs";

import { IToggleGroupItem } from "../togglegroup/IToggleGroupItem";
import { BaseBtn } from "./BaseBtn";
import { IButtonViewConfig } from "./IButtonViewConfig";
import { ResizableContainer } from "../resize/ResizableContainer";
import { BaseBtnState } from "./BaseBtnState";
import { BaseBtnEvent } from "./BaseBtnEvent";
import { DefaultButtonViewConfig } from "./DefaultButtonViewConfig";

export class BaseBtnView<DataType extends object = object> extends ResizableContainer<DataType> implements IToggleGroupItem {

    private static readonly DEFAULT_CONFIG: IButtonViewConfig = new DefaultButtonViewConfig();

    protected static DEFAULT_SIZE: Point = new Point(30, 24);

    private _config: IButtonViewConfig;

    public id: string;

    protected btn: BaseBtn;

    protected contentCont: FContainer;

    protected bg: Graphics;
    protected icon: Sprite;
    protected pressView: Sprite;
    protected overView: Sprite;

    constructor(config: IButtonViewConfig) {
        super(config);
    }

    protected construction(config: IButtonViewConfig): void {
        super.construction(config);

        this._config = config;
        if (!this._config) {
            this._config = BaseBtnView.DEFAULT_CONFIG;
        }
        ObjectTools.copyProps(this._config, BaseBtnView.DEFAULT_CONFIG, { ignoreExistedProperties: true });

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);

        this.bg = new Graphics();
        this.contentCont.addChild(this.bg);
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, 10, 10);
        this.bg.alpha = 0;

        this.pressView = new Sprite();
        this.contentCont.addChild(this.pressView);

        this.overView = new Sprite();
        this.contentCont.addChild(this.overView);

        this.icon = new Sprite();
        this.contentCont.addChild(this.icon);

        this.btn = new BaseBtn();
        this.btn.hitArea = this;
        // this.btn.commitStateDataCallback = () => this.commitStateData();

        if (config.size) {
            this.resize(config.size.x, config.size.y);
        } else {
            this.resize(BaseBtnView.DEFAULT_SIZE.x, BaseBtnView.DEFAULT_SIZE.y);
        }

        this.commitStateData();
    }

    destruction(): void {
        super.destruction();

        if (this.btn) {
            this.btn.destruction();
        }
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.btn,
            BaseBtnEvent.STATE_CHANGE,
            this.onBtnStateChange
        );

        this.eventListenerHelper.addEventListener(
            this.btn,
            BaseBtnEvent.SELECTED_CHANGE,
            this.onBtnSelectedChange
        );
    }

    protected onBtnStateChange(): void {
        this.commitStateData();

        this.dispatchEvent(new Event(BaseBtnEvent.STATE_CHANGE));
    }

    protected onBtnSelectedChange(): void {
        this.dispatchEvent(new Event(BaseBtnEvent.SELECTED_CHANGE));
    }


    protected commitData(): void {
        super.commitData();

        if (this.config.pressTextureId) {
            this.pressView.texture = Texture.from(this.config.pressTextureId);
        }

        if (this.config.overTextureId) {
            this.overView.texture = Texture.from(this.config.overTextureId);
        }

        if (this.config.iconTextureId) {
            this.icon.texture = Texture.from(this.config.iconTextureId);
        }

        this.commitStateData();
    }

    protected commitStateData(): void {

        this.contentCont.visible = true;
        this.pressView.visible = false;
        this.overView.visible = false;

        let newAlpha: number = 1;

        switch (this.btn.state) {
            case BaseBtnState.NORMAL:
                if (this.config.alphaNormal) {
                    newAlpha = this.config.alphaNormal;
                }
                break;
            case BaseBtnState.OVER:
                if (this.config.alphaOver) {
                    newAlpha = this.config.alphaOver;
                }
                this.overView.visible = true;
                break;
            case BaseBtnState.PRESS:
                this.pressView.visible = true;
                break;

            case BaseBtnState.SELECTED_NORMAL:
                if (this.config.alphaNormal) {
                    newAlpha = this.config.alphaNormal;
                }
                this.pressView.visible = true;
                break;
            case BaseBtnState.SELECTED_OVER:
                if (this.config.alphaOver) {
                    newAlpha = this.config.alphaOver;
                }

                this.overView.visible = true;
                this.pressView.visible = true;
                break;
            case BaseBtnState.SELECTED_PRESS:
                this.pressView.visible = true;
                break;
            default:
                this.contentCont.visible = true;
                break;
        }

        this.alpha = newAlpha;

        if (this.isConstructed) {
            this.arrange();
        }
    }

    public get selected(): boolean {
        return this.btn.selected;
    }

    public set selected(value: boolean) {
        if (value === this.btn.selected) {
            return;
        }

        this.btn.selected = value;
    }

    protected arrange(): void {
        super.arrange();

        this.bg.width = this.resizeSize.x;
        this.bg.height = this.resizeSize.y;

        this.icon.scale.set(1, 1);
        DisplayResizeTools.scaleObject(
            this.icon,
            this.resizeSize.x - (this.config.iconPadding.x * 2),
            this.resizeSize.y - (this.config.iconPadding.y * 2)
        );
        this.overView.scale.set(1, 1);
        DisplayResizeTools.scaleObject(this.overView, this.resizeSize.x, this.resizeSize.y);
        this.pressView.scale.set(1, 1);
        DisplayResizeTools.scaleObject(this.pressView, this.resizeSize.x, this.resizeSize.y);

        this.overView.x = Math.floor(this.bg.x + ((this.bg.width - this.overView.width) / 2));
        this.overView.y = Math.floor(this.bg.y + ((this.bg.height - this.overView.height) / 2));

        this.pressView.x = Math.floor(this.bg.x + ((this.bg.width - this.pressView.width) / 2));
        this.pressView.y = Math.floor(this.bg.y + ((this.bg.height - this.pressView.height) / 2));

        this.icon.x = Math.floor(this.bg.x + ((this.bg.width - this.icon.width) / 2));
        this.icon.y = Math.floor(this.bg.y + ((this.bg.height - this.icon.height) / 2));
    }

    get config(): IButtonViewConfig {
        return this._config;
    }

    set config(value: IButtonViewConfig) {
        this._config = value;

        this.commitData();
    }
}