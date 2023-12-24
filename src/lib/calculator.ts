const FACTOR = 15;

export const convertKgInArroba = (v: number) => Number(v / FACTOR);

export const convertArrobaInKg = (v: number) => Number(v * FACTOR);

export const formatWithThousandDot = (v: string) =>
  v
    .split("")
    .reverse()
    .map((v, i) => (i % 3 == 0 ? `.${v}` : v))
    .reverse()
    .join();
