import { GenericObjectsByTypeModel, getInstance } from "@flashist/flibs";

// Shortcuts
export const getItem: typeof GenericObjectsByTypeModel.prototype.getItem = (() => {
    const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
    return genericObjectByTypeModel.getItem;
})();

export const getItemsForType: typeof GenericObjectsByTypeModel.prototype.getItemsForType = (() => {
    const genericObjectByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
    return genericObjectByTypeModel.getItemsForType;
})();

// export const getInstance: typeof ServiceLocator.getInstance = ServiceLocator.getInstance;
// export const serviceLocatorAdd: typeof ServiceLocator.add = ServiceLocator.add;
// export const serviceLocatorProcessItemOnActivate: typeof ServiceLocator.processItemOnActivate = ServiceLocator.processItemOnActivate;
// export const serviceLocatorProcessItemOnDeactivate: typeof ServiceLocator.processItemOnDeactivate = ServiceLocator.processItemOnDeactivate;

// public getItem<ItemType extends IGenericObjectVO = IGenericObjectVO>(type: string, id: string): ItemType {
//     const typeModel: GenericObjectsModel = this.getModelForType(type);
//     return typeModel.getItem(id) as ItemType;
// }

// public getItemsForType<ItemType extends IGenericObjectVO = IGenericObjectVO>(type: string, makeCopy: boolean = true): ItemType[] {
//     const typeModel: GenericObjectsModel = this.getModelForType(type);
//     return typeModel.getAllItems(makeCopy) as ItemType[];
// }