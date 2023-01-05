import { IFConsoleConfigVO } from "@flashist/fconsole/console/config/IFConsoleConfigVO";

export const DebugModuleInitialState = {
    debug: {
        fconsole: {
            console: {
                defaultVisible: true
            }
        } as Partial<IFConsoleConfigVO>
    }
};

export type DebugModuleState = typeof DebugModuleInitialState;