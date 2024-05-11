import {
  Buffer
} from 'buffer';

// functions to serialize/deserialize data, and anything else that
// doesn't need to touch the context states.

export function serializeInt(intInput: number): number[] {
  // quick function just to try serializing a single number

  let buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(intInput, 0);
  return Array.from(buffer);
}