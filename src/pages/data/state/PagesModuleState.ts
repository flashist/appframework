import { IConstructor } from "@flashist/fcore";

export const PagesModuleInitialState = {
    pages: {
        pageId: "",
        pageIdToViewClassMap: {} as { [pageId: string]: IConstructor },
        activePageContentScale: {x: 0, y: 0}
    }
};

export type PagesModuleState = typeof PagesModuleInitialState;