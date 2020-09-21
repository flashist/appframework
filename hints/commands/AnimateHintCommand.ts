import {NumberTools, ObjectTools} from "@flashist/fcore";
import {DisplayObject, FContainer, getInstance} from "@flashist/flibs";

import {TweenLite, Sine, Back} from "gsap";

import {BaseAppCommand} from "../../base/commands/BaseAppCommand";
import {ContainersManager} from "../../containers/managers/ContainersManager";
import {HintContainerId} from "../data/HintContainerId";
import {IHintConfig} from "../data/IHintConfig";
import {DefaultHintConfig} from "../data/DefaultHintConfig";

export class AnimateHintCommand extends BaseAppCommand {

    protected config: IHintConfig;

    constructor(protected hint: DisplayObject, config: Partial<IHintConfig>) {
        super();

        this.config = {} as any;

        ObjectTools.copyProps(
            this.config,
            config
        );

        ObjectTools.copyProps(
            this.config,
            new DefaultHintConfig(),
            {
                ignoreExistedProperties: true
            }
        );
    }

    protected executeInternal(): void {

        const containersManager: ContainersManager = getInstance(ContainersManager);
        const effectsCont: FContainer = containersManager.getContainer(HintContainerId);
        effectsCont.addChild(this.hint);

        const localPos = effectsCont.toLocal(this.config.startGlobalPos);
        this.hint.x = localPos.x;
        this.hint.y = localPos.y;

        const tempFinalY: number = localPos.y + NumberTools.getRandom(
            this.config.finalGlobalPosMinChange.y,
            this.config.finalGlobalPosMaxChange.y
        );
        TweenLite.to(
            this.hint,
            this.config.positionTweenDuration,
            {
                y: tempFinalY,
                ease: Sine.easeOut
            }
        );

        const tempFinalX: number = localPos.x + NumberTools.getRandom(
            this.config.finalGlobalPosMinChange.x,
            this.config.finalGlobalPosMaxChange.x
        );
        TweenLite.to(
            this.hint,
            this.config.positionTweenDuration,
            {
                x: tempFinalX,
                ease: Back.easeOut
            }
        );

        this.hint.alpha = this.config.startAlpha;
        TweenLite.to(
            this.hint,
            this.config.startAlphaTweenDuration,
            {
                delay: this.config.startAlphaTweenDelay,

                alpha: this.config.mainAlpha
            }
        );
        TweenLite.to(
            this.hint,
            this.config.startAlphaTweenDuration,
            {
                delay: this.config.finalAlphaTweenDelay,
                alpha: this.config.finalAlpha,
                onComplete: () => {
                    this.readyToComplete();
                }
            }
        );
    }

    protected readyToComplete(): void {
        this.hint.parent.removeChild(this.hint);

        this.notifyComplete();
    }
}