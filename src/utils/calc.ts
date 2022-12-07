export const averageAmplitude = (dataArray: Uint8Array, length: number) =>
  dataArray.slice(0, length).reduce((prev, cur) => prev + cur) / length;
