const FACTOR = 15;

export const convertKgInArroba = (v: number) => Number(v / FACTOR);

export const convertArrobaInKg = (v: number) => Number(v * FACTOR);
