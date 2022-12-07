import { Audio } from './class/entities/Audio';
import { Model1 } from './models/model1';

export const init = () => {
  const audioContext = new AudioContext();
  const audio = new Audio(audioContext, 'music.wav');
  const startButton = document.getElementById('startButton')!;
  const playButton = document.getElementById('playButton')!;

  startButton.addEventListener('click', () => {
    audio.start().catch(() => {});
    playButton.innerText = 'stop';
  });
  playButton.addEventListener('click', () => {
    audio.play(playButton);
  });

  const model1 = new Model1(audio, startButton, playButton);
  const model2 = new Model1(audio, startButton, playButton);
};
