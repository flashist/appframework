import { IFConsoleConfigVO } from "@flashist/fconsole/console/config/IFConsoleConfigVO";
import { IDebugModuleConfigVO } from "./IDebugModuleConfigVO";

export class DefaultDebugModuleConfigVO implements IDebugModuleConfigVO {
    fconsoleConfig: Partial<IFConsoleConfigVO> = {
        console: {
            defaultVisible: true
        }
    } as any;
}