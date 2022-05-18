import { BadRequestException } from '@nestjs/common';
import { EncryptService } from './encrypt.service';

describe('Encrypt service', () => {
  let service: EncryptService;
  beforeAll(async () => {
    service = new EncryptService();
    process.env.SECRET_JWT = 'hello51';
  });

  it(`Hash string sucessfully`, async () => {
    expect(await service.hash('string')).toContain('$2b$10$');
  });

  it(`Verify hashed string sucessfully`, async () => {
    const hash = await service.hash('string');

    expect(await service.compareHash('string', hash)).toBeTruthy();
  });

  it(`Encrypt an object sucessfully`, async () => {
    const enc = await service.encrypt({
      respondentId: 1,
      respondentIdentifier: '123',
      surveyId: 1,
    });
    expect(enc).toContain('.');
    expect(enc.split('.').length).toEqual(2);
  });

  it(`Encrypt a string sucessfully`, async () => {
    const enc = await service.encrypt('string');
    expect(enc).toContain('.');
    expect(enc.split('.').length).toEqual(2);
  });

  it(`Decript object sucessfully`, async () => {
    expect(
      await service.decrypt(
        '1W7Vq19FPZXJcw7DthOk7TU/xxmW9lWUYM50u2RlVqBc/MZ19bi6ZH0+nvM/4NVdnTYaUjnA91PeqlhU.sG6Jb4c3zikN60IQkMOE4Q==',
      ),
    ).toEqual({
      respondentId: 1,
      respondentIdentifier: '123',
      surveyId: 1,
    });
  });

  it(`Decript string sucessfully`, async () => {
    expect(await service.decrypt('fdp1e5A5.W6T2C2WAniFm0BAQiXVkWQ==')).toEqual(
      'string',
    );
  });

  it(`Decript object throws error if invalid token`, async () => {
    try {
      await service.decrypt('04f524b206823aef3');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });
});
