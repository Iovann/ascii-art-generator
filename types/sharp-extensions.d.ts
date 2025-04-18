import * as sharp from 'sharp';

declare module 'sharp' {
  // Étendre la fonction sharp pour accepter n'importe quel type de Buffer
  function sharp(input: Buffer | ArrayBufferLike | ArrayBuffer): sharp.Sharp;
}
