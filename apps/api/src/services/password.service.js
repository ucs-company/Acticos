const ITERATIONS = 100000;
const encoder = new TextEncoder();
let dummyHash;

const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
};

const constantEqual = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a[index] ^ b[index];
  }
  return diff === 0;
};

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password, iterations = ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, iterations);
  return `pbkdf2$${iterations}$${toHex(salt)}$${toHex(hash)}`;
}

export async function verifyPassword(password, stored) {
  if (!dummyHash) dummyHash = hashPassword('not-a-real-password');
  const value = stored || await dummyHash;
  const parts = String(value).split('$');

  if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
    await derive(password, new Uint8Array(16), ITERATIONS);
    return false;
  }

  const iterations = Number(parts[1]);
  const salt = fromHex(parts[2]);
  const expected = fromHex(parts[3]);
  const actual = await derive(password, salt, iterations);
  return constantEqual(actual, expected);
}
