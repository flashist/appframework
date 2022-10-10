import {IGenericObjectVO} from "@flashist/flibs";

export interface IServerRequestVO {
    requestId: string;
    loginData?: string;

    items?: IGenericObjectVO;

    // This is needed because since some typescript version it's not possible
    // to use object with fields, not described in an interface
    [key: string]: any;
}