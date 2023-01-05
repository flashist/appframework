
// import {PagesModel} from "./models/PagesModel";
import { BaseAppModule } from "../base/modules/BaseAppModule";
import { serviceLocatorAdd } from "@flashist/flibs";
import { PagesView } from "./views/PagesView";
import { PagesMediator } from "./views/PagesMediator";
import { PagesModuleInitialState } from "./data/state/PagesModuleStateType";
import { appStorage } from "../state/AppStateModule";

export class PagesModule extends BaseAppModule {

    init(): void {
        super.init();

        // Init the app with initial state
        appStorage().initializeWith(PagesModuleInitialState);

        //
        serviceLocatorAdd(PagesView, { activateeConstructors: [PagesMediator] });
    }
}