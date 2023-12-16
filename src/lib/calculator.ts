const FACTOR = 15;

export const convertKgInArroba = (v: number) =>
  Number((v / FACTOR).toPrecision(2));
export const convertArrobaInKg = (v: number) =>
  Number((v * FACTOR).toPrecision(2));
