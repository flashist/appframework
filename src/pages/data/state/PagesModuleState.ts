import { IConstructor } from "@flashist/fcore";

export const PagesModuleInitialState = {
    pagesModule: {
        pageId: "",
        pageIdToViewClassMap: {} as { [pageId: string]: IConstructor }
    }
};

export type PagesModuleState = typeof PagesModuleInitialState;