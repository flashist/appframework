import {BaseObject} from "@flashist/fcore";
import {Sound, getInstance, SoundsManager} from "@flashist/flibs";

export class BackgroundMusicManager extends BaseObject {

    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    protected currentMusic: Sound;
    protected currentMusicId: string;

    public fadeInTime: number = 0.5;
    public fadeOutTime: number = 0.5;

    public changeMusic(id: string): void {
        if (this.currentMusicId === id) {
            return;
        }

        this.stopMusic();

        this.currentMusicId = id;
        this.currentMusic = this.soundsManager.getSound(id);
        if (this.currentMusic) {
            // this.currentMusic.setVolume(0);
            this.currentMusic.play({loop: true});
            this.currentMusic.tweenVolume(1, this.fadeInTime);
        }
    }

    public stopMusic(): void {
        if (!this.currentMusic) {
            return;
        }

        // Make link-copy of the currently played music, as it might be changed after volume tween
        const currentMusicCopy: Sound = this.currentMusic;
        this.currentMusic = null;
        this.currentMusicId = null;

        currentMusicCopy.tweenVolume(
            0,
            this.fadeOutTime,
            () => {
                currentMusicCopy.stop();
            }
        );
    }
}