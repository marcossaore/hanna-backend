import * as argon2 from 'argon2';

export class HashService {
  async hash(key: string): Promise<string> {
      const hashedKey = await argon2.hash(key);
      return hashedKey;
  }

  async verify(hashed: string, input: string): Promise<boolean> {
      const isMatch = await argon2.verify(hashed, input);
      return isMatch;
  }
}
