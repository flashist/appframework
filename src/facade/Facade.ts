import { BaseObject, Command, IEventListenerCallback } from "@flashist/fcore";

import { FApp, getInstance, HtmlTools, Point, ServiceLocator } from "@flashist/flibs";

import { GlobalEventDispatcherModule } from "../globaleventdispatcher/GlobalEventDispatcherModule";
import { AppAppModulesManager } from "../base/modules/AppModulesManager";
import { PagesModule } from "../pages/PagesModule";
import { RendererModule } from "../renderer/RendererModule";
import { IFacadeOptions } from "./IFacadeOptions";
import { AppModule } from "../app/AppModule";
import { TimeModule } from "../time/TimeModule";
import { DebugModule } from "../debug/DebugModule";
import { LoadModule } from "../load/LoadModule";
import { DependenciesModule } from "../dependencies/DependenciesModule";
import { AssetsModule } from "../assets/AssetsModule";
import { ContainersModule } from "../containers/ContainersModule";
import { ObjectsPoolModule } from "../pool/ObjectsPoolModule";
import { LocalesModule } from "../locales/LocalesModule";
import { StorageModule } from "../storage/StorageModule";
import { SoundsModule } from "../sounds/SoundsModule";
import { HTMLModule } from "../html/HTMLModule";
import { InitApplicationCommand } from "../init/commands/InitApplicationCommand";
import { RendererManager } from "../renderer/managers/RendererManager";
import { GlobalEventDispatcher } from "../globaleventdispatcher/dispatcher/GlobalEventDispatcher";
import { RendererManagerEvent } from "../renderer/events/RendererManagerEvent";
import { ServerModule } from "../server/ServerModule";
import { AppMainContainer } from "../app/views/AppMainContainer";
import { BaseAppModule } from "../base/modules/BaseAppModule";
import { InitApplicationEvent } from "../init/events/InitApplicationEvents";

export class Facade extends BaseObject {

    protected options: IFacadeOptions;
    protected modulesManager: AppAppModulesManager;
    protected rendererManager: RendererManager;

    public app: FApp;
    public mainContainer: AppMainContainer;

    protected resizeListener: any;

    constructor(options: IFacadeOptions) {
        super(options);
    }

    protected construction(options: IFacadeOptions): void {
        super.construction(options);

        this.options = options;

        Facade._instance = this;
        if (this.options.debug) {
            window["Facade"] = this;
        }

        ServiceLocator.startInit({ debug: this.options.debug });

        this.addModules();
        this.activateModules();

        //
        this.rendererManager = getInstance(RendererManager);

        // this.initView();

        // Start the init process
        const initCmd: Command = getInstance(InitApplicationCommand);
        initCmd.execute();
    }

    protected addModules(): void {
        this.modulesManager = new AppAppModulesManager();

        this.addSingleModule(new DependenciesModule());
        this.addSingleModule(new ObjectsPoolModule());
        this.addSingleModule(new GlobalEventDispatcherModule());
        this.addSingleModule(new RendererModule());
        this.addSingleModule(new StorageModule());
        this.addSingleModule(new LoadModule());
        this.addSingleModule(new SoundsModule());
        this.addSingleModule(new HTMLModule());
        this.addSingleModule(new LocalesModule());
        this.addSingleModule(new AssetsModule());
        this.addSingleModule(new PagesModule());

        this.addSingleModule(new RendererModule());

        this.addSingleModule(new AppModule());
        this.addSingleModule(new TimeModule());
        this.addSingleModule(new ContainersModule());
        this.addSingleModule(new ServerModule());

        if (this.options.debug) {
            this.addSingleModule(new DebugModule());
        }
    }

    public activateModules(): void {
        // First: configure all injections
        this.modulesManager.initModules();
        // Second: activate the service locator object
        ServiceLocator.activate();
        // Activate modules (after Service Locator activation)
        this.modulesManager.activateModules();
    }

    public addSingleModule(module: BaseAppModule): void {
        this.modulesManager.addModule(module);
    }

    protected onReadyToInitView(): void {
        this.initView();
    }

    protected initView(): void {
        this.mainContainer = getInstance(AppMainContainer);
        FApp.instance.stage.addChild(this.mainContainer);

        this.onWindowResize();
        this.onRendererResize();
    }

    protected addListeners(): void {
        super.addListeners();
        /**
         * Note: temporary solution, until pixi.js improvements are released in npm: https://github.com/pixijs/pixi.js/pull/6415
         * (when they are released, the Renderer will emit resize event itself, it means
         * that in combination with resizeTo there won't be a need to "control" resize outside)
         */
        this.resizeListener = () => {
            this.onWindowResize();

            // In some cases there is a need to add timeout for HTML DOM to be updated
            setTimeout(
                () => {
                    this.onWindowResize();
                },
                100
            );
        };
        window.addEventListener(
            "resize",
            this.resizeListener
        );

        const globalEventDispatcher: GlobalEventDispatcher = getInstance(GlobalEventDispatcher);
        this.eventListenerHelper.addEventListener(
            globalEventDispatcher,
            RendererManagerEvent.RESIZE,
            this.onRendererResize
        )

        this.eventListenerHelper.addEventListener(
            globalEventDispatcher,
            InitApplicationEvent.READY_TO_INIT_VIEW,
            this.onReadyToInitView
        );
    }

    protected removeListeners(): void {
        super.removeListeners();

        window.removeEventListener(
            "resize",
            this.resizeListener
        );
    }

    protected onWindowResize(): void {
        const documentSize: Point = HtmlTools.getDocumentSize();
        this.rendererManager.resize(documentSize.x, documentSize.y, window.devicePixelRatio);
    }

    protected onRendererResize(): void {
        this.arrange();
    }

    protected readyToInitView(): void {
        this.initView();
    }

    protected arrange(): void {
        if (this.mainContainer) {
            this.mainContainer.resize(
                this.rendererManager.rendererWidth,
                this.rendererManager.rendererHeight
            );
        }
    }

    // - - - - -

    private static _instance: Facade;

    static init(options?: IFacadeOptions): void {
        if (!options) {
            options = {};
        }
        let FacadeClass = options.FacadeClass;
        if (!FacadeClass) {
            FacadeClass = Facade;
        }

        new FacadeClass(options);
    }

    static get instance(): Facade {
        if (!Facade._instance) {
            console.error("ERROR! Facade should be prepared via the Facade.init method before used via Facade.instance!");
            return;
        }
        return Facade._instance;
    }
}