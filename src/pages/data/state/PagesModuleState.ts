import { IConstructor } from "@flashist/fcore";

export const PagesModuleInitialState = {
    pages: {
        pageId: "",
        pageIdToViewClassMap: {} as { [pageId: string]: IConstructor }
    }
};

export type PagesModuleState = typeof PagesModuleInitialState;