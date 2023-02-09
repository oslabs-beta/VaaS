import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import { encodeSession, decodeSession } from '../server/services/jwt';

// const mongoUser = process.env.MONGO_USERNAME;
// const mongoPass = process.env.MONGO_PASSWORD;
// const mongoUrl = process.env.MONGO_URL;

describe('JWT encoding / decoding tests', () => {
  const payload = { id: 'bar', username: 'foo' };
  const secret = process.env.JWT_ACCESS_SECRET;

  describe('JWT encoding', () => {
    it('Should return an encoded token', async () => {
      const encoded = encodeSession(secret, payload);
      expect(encoded).toBeDefined();
      expect(encoded).not.toEqual(payload);
      expect(Object.keys(encoded)).toEqual(['token']);
    });
  });

  describe('JWT decoding', () => {
    it('Should decode an encoded token', async () => {
      const encoded = encodeSession(secret, payload);
      const decoded = decodeSession(secret, encoded.token);
      expect(decoded).toBeDefined();
      expect(decoded).not.toEqual(encoded);
      //@ts-ignore
      const { id, username } = decoded.session;
      expect({ id, username }).toEqual(payload);
    });
  });
});
