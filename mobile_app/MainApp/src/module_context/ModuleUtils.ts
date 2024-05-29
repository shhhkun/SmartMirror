export const prepareDataToSend = (
  enableData: boolean, positionData: string): Map<string, number[]> => {

  const dataToSend: Map<string, number[]> = new Map();

  dataToSend.set('enable', [enableData ? 1 : 0]);

  return dataToSend;
};