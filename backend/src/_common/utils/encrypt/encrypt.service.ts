import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  async hash(string: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(string, salt);
  }

  async compareHash(notEncrypted: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(notEncrypted, encrypted);
  }

  async encrypt<T>(obj: T): Promise<string> {
    try {
      const key = await this.getKey();
      const iv = randomBytes(16);
      const cipher = createCipheriv('aes-256-ctr', key, iv);

      return (
        Buffer.concat([
          cipher.update(typeof obj == 'string' ? obj : JSON.stringify(obj)),
          cipher.final(),
        ]).toString('base64') +
        '.' +
        iv.toString('base64')
      );
    } catch (e) {
      throw new InternalServerErrorException('Encryption Error', e.message);
    }
  }

  async decrypt<T>(token: string): Promise<T> {
    try {
      const [encrypted, iv] = token.split('.');
      const iv2 = Buffer.from(iv, 'base64');
      const key = await this.getKey();
      const decipher = createDecipheriv('aes-256-ctr', key, iv2);
      const dencrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, 'base64')),
        decipher.final(),
      ]).toString();

      return dencrypted.startsWith('{') ? JSON.parse(dencrypted) : dencrypted;
    } catch (e) {
      throw new BadRequestException('Invalid token', e.message);
    }
  }

  private async getKey() {
    const key = (await promisify(scrypt)(
      process.env.SECRET_JWT,
      'salt',
      32,
    )) as Buffer;

    return key;
  }
}
