import { BaseObject, Command } from "@flashist/fcore";

import { FApp, getInstance, HtmlTools, Point, ServiceLocator } from "@flashist/flibs";

import { AppModule } from "../app/AppModule";
import { AppMainContainer } from "../app/views/AppMainContainer";
import { AppModulesManager } from "../base/modules/AppModulesManager";
import { BaseAppModule } from "../base/modules/BaseAppModule";
import { ContainersModule } from "../containers/ContainersModule";
import { DebugModule } from "../debug/DebugModule";
import { DeviceModuleState } from "../device/data/state/DeviceModuleState";
import { DeviceModule } from "../device/DeviceModule";
import { GlobalEventDispatcher } from "../globaleventdispatcher/dispatcher/GlobalEventDispatcher";
import { GlobalEventDispatcherModule } from "../globaleventdispatcher/GlobalEventDispatcherModule";
import { HTMLModule } from "../html/HTMLModule";
import { InitApplicationCommand } from "../init/commands/InitApplicationCommand";
import { InitApplicationEvent } from "../init/events/InitApplicationEvent";
import { LoadModule } from "../load/LoadModule";
import { LocalStorageModule } from "../local-storage/LocalStorageModule";
import { LocalesModule } from "../locales/LocalesModule";
import { PagesModule } from "../pages/PagesModule";
import { ObjectsPoolModule } from "../pool/ObjectsPoolModule";
import { RendererManagerEvent } from "../renderer/events/RendererManagerEvent";
import { RendererManager } from "../renderer/managers/RendererManager";
import { RendererModule } from "../renderer/RendererModule";
import { SoundsModule } from "../sounds/SoundsModule";
import { DeepReadonly } from "../state";
import { AppStateModule, appStorage } from "../state/AppStateModule";
import { TimeModule } from "../time/TimeModule";
import { IFacadeOptions } from "./IFacadeOptions";

export class Facade extends BaseObject {

    protected options: IFacadeOptions;
    protected modulesManager: AppModulesManager;
    protected rendererManager: RendererManager;

    public app: FApp;
    public mainContainer: AppMainContainer;

    protected resizeListener: any;

    constructor(options: IFacadeOptions) {
        super(options);
    }

    protected async construction(options: IFacadeOptions) {
        super.construction(options);

        this.options = options;

        Facade._instance = this;
        if (this.options.debug) {
            window["Facade"] = this;
        }

        ServiceLocator.startInit({ debug: this.options.debug });

        this.addModules();
        await this.activateModules();

        //
        this.rendererManager = getInstance(RendererManager);

        // this.initView();

        // Start the init process
        // const initCmd: Command = getInstance(InitApplicationCommand);
        // initCmd.execute();
        this.initApp();
    }

    protected addModules(): void {
        this.modulesManager = new AppModulesManager();

        // AppState should be inited THE FIRST!
        // because other modules might add there init data
        this.addSingleModule(new GlobalEventDispatcherModule());
        this.addSingleModule(new AppStateModule())
        this.addSingleModule(new AppModule(this.options.debug));
        //
        this.addSingleModule(new ObjectsPoolModule());
        this.addSingleModule(new DeviceModule());
        this.addSingleModule(new RendererModule());
        this.addSingleModule(new LocalStorageModule());
        this.addSingleModule(new LoadModule());
        this.addSingleModule(new SoundsModule());
        this.addSingleModule(new HTMLModule());
        this.addSingleModule(new LocalesModule());

        this.addSingleModule(new PagesModule());

        this.addSingleModule(new TimeModule());
        this.addSingleModule(new ContainersModule());

        if (this.options.debug) {
            this.addSingleModule(new DebugModule());
        }
    }

    protected async activateModules() {
        // First: configure all injections
        this.modulesManager.initModules();
        // Second: activate the service locator object
        ServiceLocator.activate();
        // Activate modules (after Service Locator activation)
        await this.modulesManager.activateModules();
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
        const appState: DeepReadonly<DeviceModuleState> = appStorage().getState<DeviceModuleState>();
        this.rendererManager.resize(documentSize.x, documentSize.y, appState.device.pixelRatio);
    }

    protected onRendererResize(): void {
        this.arrange();
    }

    protected async initApp() {
        await getInstance(InitApplicationCommand)
            .execute();
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