const getFile = async (
  audioContext: AudioContext,
  filepath: string,
): Promise<AudioBuffer> => {
  const response: Response = await fetch(filepath);
  const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
  const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(
    arrayBuffer,
  );
  return audioBuffer;
};

export const setupSample = async (
  audioContext: AudioContext,
  filepath: string,
): Promise<AudioBuffer> => {
  const sample = await getFile(audioContext, filepath);
  return sample;
};

export const playSample = (
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  time = 0,
): AudioBufferSourceNode => {
  const sampleSource = new AudioBufferSourceNode(audioContext, {
    buffer: audioBuffer,
  });
  sampleSource.connect(audioContext.destination);
  sampleSource.start(time);
  return sampleSource;
};
