import { Audio } from '../entities/Audio';

export abstract class Component {
  protected audio: Audio;

  protected animeID = 0;

  private playButton: HTMLElement;

  private startButton: HTMLElement;

  private isStarted = false;

  private isPlay = false;

  constructor(audio: Audio, startButton: HTMLElement, playButton: HTMLElement) {
    this.audio = audio;
    this.startButton = startButton;
    this.playButton = playButton;
    this.startButton.addEventListener('click', this.start);
    this.playButton.addEventListener('click', this.play);
  }

  abstract animate: () => void;

  start = () => {
    if (this.isStarted === true) return;
    this.animate();
    this.isPlay = true;
    this.isStarted = true;
  };

  play = () => {
    if (this.isStarted === false) return;
    if (this.isPlay === true) {
      this.isPlay = false;
      cancelAnimationFrame(this.animeID);
    } else if (this.isPlay === false) {
      this.isPlay = true;
      this.animate();
    }
  };
}
