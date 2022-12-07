import { setupSample } from '../../utils/audio';

export class Audio {
  private audioContext: AudioContext;

  private path: string;

  private dtmf: AudioBuffer | undefined;

  private sampleSource: AudioBufferSourceNode | undefined;

  // public

  analyser: AnalyserNode;

  bufferLength: number;

  dataArray: Uint8Array;

  isStarted = false;

  isPlay = false;

  constructor(audioContext: AudioContext, path: string) {
    this.audioContext = audioContext;
    this.path = path;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.connect(this.audioContext.destination);
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  start = async () => {
    if (this.isStarted === true) return;
    this.dtmf = await setupSample(this.audioContext, this.path);
    this.sampleSource = new AudioBufferSourceNode(this.audioContext, {
      buffer: this.dtmf,
    });
    this.sampleSource.loop = true;
    this.sampleSource.connect(this.analyser);
    this.sampleSource.start();
    this.isPlay = true;
    this.isStarted = true;
    console.log('start');
  };

  play = (playButton: HTMLElement) => {
    if (this.isStarted === false) return;
    if (this.isPlay === true) {
      this.suspend();
      this.isPlay = false;
      playButton.innerText = 'play';
    } else if (this.isPlay === false) {
      this.resume();
      this.isPlay = true;
      playButton.innerText = 'stop';
    }
  };

  suspend = () => {
    this.audioContext.suspend()!;
  };

  resume = () => {
    this.audioContext.resume()!;
  };
}
