import {IHintConfig} from "./IHintConfig";
import {Point} from "@flashist/flibs";
import {HintContainerId} from "./HintContainerId";

export class DefaultHintConfig implements Partial<IHintConfig> {

    containerId: string = HintContainerId;

    positionTweenDuration: number = 1.5;
    finalGlobalPosMinChange: Point = new Point(0, -100);
    finalGlobalPosMaxChange: Point = new Point(0, -150);

    startAlphaTweenDuration: number = 0.25;
    startAlphaTweenDelay: number = 0;
    finalAlphaTweenDuration: number = 0.25;
    finalAlphaTweenDelay: number = 1.25;

    startAlpha: number = 0;
    mainAlpha: number = 1;
    finalAlpha: number = 0;

}