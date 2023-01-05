import { DeviceTools } from "@flashist/flibs";

export const DeviceModuleInitialState = {
    device: DeviceTools.getDeviceInfo(navigator.userAgent)
};

export type DeviceModuleState = typeof DeviceModuleInitialState;