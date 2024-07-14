import { FastAverageColor } from "fast-average-color";

export default async function getAverageColor(imageUrl: string) {
  if (!imageUrl)
    return {
      bgDominantColor: [0, 0, 0, 0] as [number, number, number, number],
      bgColorIsLight: false,
    };

  const fac = new FastAverageColor();
  const color = await fac.getColorAsync(imageUrl);

  const bgDominantColor = color.value;
  const bgColorIsLight = color.isLight;

  return {
    bgDominantColor: bgDominantColor || [0, 0, 0, 0],
    bgColorIsLight: bgColorIsLight || false,
  };
}
