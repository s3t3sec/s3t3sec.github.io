import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const sourceDir = new URL('../docs/sources/included-original-images/', import.meta.url);
const publicDir = new URL('../public/images/writeups/included/', import.meta.url);
const ink = '#111315';

const redactions = [
  { name: '09-arquivos-autenticacao.png', rectangles: [{ left: 65, top: 255, width: 103, height: 18 }] },
  { name: '10-upgrade-pty.png', rectangles: [{ left: 91, top: 115, width: 106, height: 18 }] },
];

for (const { name, rectangles } of redactions) {
  const original = await readFile(new URL(name, sourceDir));
  const { width, height } = await sharp(original).metadata();
  if (!width || !height || rectangles.some(({ left, top, width: w, height: h }) => left < 0 || top < 0 || left + w > width || top + h > height)) {
    throw new Error(`Região de redação fora da imagem: ${name}`);
  }
  const overlays = rectangles.map(({ left, top, width: w, height: h }) => ({
    input: Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${ink}"/></svg>`),
    left,
    top,
  }));
  const publicImage = await sharp(original).composite(overlays).png().toBuffer();
  const originalPixels = await sharp(original).ensureAlpha().raw().toBuffer();
  const publicPixels = await sharp(publicImage).ensureAlpha().raw().toBuffer();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const covered = rectangles.some(({ left, top, width: w, height: h }) => x >= left && x < left + w && y >= top && y < top + h);
      const expected = covered ? [17, 19, 21, 255] : originalPixels.subarray(offset, offset + 4);
      if (expected.some((value, channel) => publicPixels[offset + channel] !== value)) {
        throw new Error(`Pixels inesperados na versão pública: ${name}`);
      }
    }
  }
  await writeFile(new URL(name, publicDir), publicImage);
  console.log(`Versão pública redigida: ${name}`);
}
