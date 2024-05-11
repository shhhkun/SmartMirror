import {
  Buffer
} from 'buffer';

// functions to serialize/deserialize data, and anything else that
// doesn't need to touch the context states.

export function serializeInt(intInput: number): number[] {
  // quick function just to try serializing a single number

  if (intInput < 0 || intInput > 255) {
    throw new Error('Input must be between 0 and 255');
  }

  let buffer: Buffer = Buffer.alloc(1);
  buffer.writeUInt32LE(intInput, 0);
  const byteArray: number[] = Array.from(buffer);
  return byteArray;
}