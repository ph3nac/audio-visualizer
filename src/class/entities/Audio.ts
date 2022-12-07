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
    this.dtmf = await setupSample(this.audioContext, this.path);
    this.sampleSource = new AudioBufferSourceNode(this.audioContext, {
      buffer: this.dtmf,
    });
    this.sampleSource.loop = true;
    this.sampleSource.connect(this.analyser);
    this.sampleSource.start();
  };

  suspend = () => {
    this.audioContext.suspend()!;
  };

  resume = () => {
    this.audioContext.resume()!;
  };
}
