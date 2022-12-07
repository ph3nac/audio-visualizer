import { Audio } from './class/entities/Audio';
import { Model1 } from './models/model1';

export const init = () => {
  const audioContext = new AudioContext();
  const audio = new Audio(audioContext, 'music.wav');
  const model1 = new Model1(audio);
  const model2 = new Model1(audio);
};
