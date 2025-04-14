import NodeCrypto from 'node:crypto'

export const ALGORITHM = 'aes-256-gcm';

export function encrypt(value: string, encryptionKey: string, { hintSize = 4 } = {}) {
  // Create a 32 byte hash from the secret key
  const hashedKey = NodeCrypto.createHash('sha256').update(encryptionKey).digest();

  // Generate a random 16 byte initialization vector
  const iv = NodeCrypto.randomBytes(16);

  // Create the cipher
  const cipher = NodeCrypto.createCipheriv(ALGORITHM, hashedKey, iv);

  // Convert the value to a buffer
  const valueBuf = Buffer.from(value);

  // Encrypt the value
  const encrypted = Buffer.concat([cipher.update(valueBuf), cipher.final()]);

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  // Prepend the authentication tag and initialization vector to the encrypted buffer
  const ciphertext = [authTag, iv, encrypted]
    .map((buf) => buf.toString('hex')) // Convert all values to hex
    .join(':'); // Return a `:` delimited hex string

  // Create the hint
  const hint = hintSize ? value.slice(-1 * hintSize) : '';

  return { ciphertext, hint };
}

export function encryptObjectValues(
  obj,
  encryptionKey,
  { hintSize = 4, onlyEncryptKeys = [] }: { hintSize?: number, onlyEncryptKeys?: string[] } = {},
) {
  const returnEncrypted = (item, shouldEncrypt = true) => {
    if (typeof item === 'string' && shouldEncrypt) {
      return encrypt(item, encryptionKey, { hintSize }).ciphertext;
    }

    if (typeof item === 'number' && shouldEncrypt) {
      return encrypt(item.toString(), encryptionKey, { hintSize }).ciphertext;
    }

    return item;
  };

  const encryptAll = onlyEncryptKeys.length === 0;

  return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
    const shouldEncrypt = encryptAll || onlyEncryptKeys.includes(key);

    if (typeof value === 'function') {
      return [key, value];
    }

    if (Array.isArray(value) && shouldEncrypt) {
      return [key, value.map((item) => {
        if (typeof item === 'function') {
          return item;
        }

        if (typeof item === 'object') {
          return encryptObjectValues(item, encryptionKey, {
            hintSize,
            onlyEncryptKeys,
          });
        }

        return returnEncrypted(item);
      })];
    }

    if (typeof value === 'object') {
      return [key, encryptObjectValues(value, encryptionKey, {
        hintSize,
        onlyEncryptKeys,
      })];
    }

    return [key, returnEncrypted(value, shouldEncrypt)];
  }));
}

export function decrypt(ciphertext, encryptionKey) {
  const hashedKey = NodeCrypto.createHash('sha256').update(encryptionKey).digest();
  const [authTagHex, ivHex, encrypted] = ciphertext.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = NodeCrypto.createDecipheriv(ALGORITHM, hashedKey, iv);

  decipher.setAuthTag(authTag);

  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}
