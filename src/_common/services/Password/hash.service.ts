import * as argon2 from 'argon2';

export class HashService {
  async hash(key: string): Promise<string> {
    try {
      const hashedKey = await argon2.hash(key);
      return hashedKey;
    } catch (error) {
      throw new Error('Failed to hash the password');
    }
  }

  async verify(hashed: string, input: string): Promise<boolean> {
    try {
      const isMatch = await argon2.verify(hashed, input);
      return isMatch;
    } catch (error) {
      throw new Error('Failed to verify the password');
    }
  }
}
