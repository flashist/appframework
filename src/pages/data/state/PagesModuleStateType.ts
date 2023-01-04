import { IConstructor } from "@flashist/fcore";

export const PagesModuleInitialState = {
    pagesModule: {
        pageId: "",
        pageIdToViewClassMap: {} as {[pageId: string]: IConstructor}
    }
};

export type PagesModuleStateType = typeof PagesModuleInitialState;