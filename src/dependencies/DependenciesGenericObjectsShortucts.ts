import { GenericObjectsByTypeModel, getInstance } from "@flashist/flibs";

// Shortcuts
// export const getItem: typeof GenericObjectsByTypeModel.prototype.getItem = (() => {
//     const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
//     return genericObjectByTypeModel.getItem.bind(genericObjectByTypeModel);
// })();

// export const getItemsForType: typeof GenericObjectsByTypeModel.prototype.getItemsForType = (() => {
//     const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
//     return genericObjectByTypeModel.getItemsForType.bind(genericObjectByTypeModel);
// })();
export class DependenciesGenericObjectsShortucts {
    static getItem: typeof GenericObjectsByTypeModel.prototype.getItem;
    static getItemsForType: typeof GenericObjectsByTypeModel.prototype.getItemsForType;
}

export let getItem = DependenciesGenericObjectsShortucts.getItem;
export let getItemsForType = DependenciesGenericObjectsShortucts.getItemsForType;