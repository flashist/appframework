import {BaseDataVO, GenericObjectsWithStaticTools, IGenericObjectVO, IGenericObjectWithStaticVO} from "@flashist/flibs";

export class BaseAppObjectWithStaticVO<StaticDataType extends IGenericObjectVO = IGenericObjectVO>
    extends BaseDataVO
    implements IGenericObjectWithStaticVO<StaticDataType> {

    staticId: string;
    staticType: string;

    get static(): StaticDataType {
        return GenericObjectsWithStaticTools.getStaticObject<StaticDataType>(this);
    }
}