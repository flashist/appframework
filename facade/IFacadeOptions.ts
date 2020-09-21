import {IConstructor} from "@flashist/fcore";
import {Facade} from "./Facade";

export interface IFacadeOptions {
    FacadeClass?: IConstructor<Facade>;
    debug?: boolean;
}