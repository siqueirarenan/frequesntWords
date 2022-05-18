import { BadRequestException } from '@nestjs/common';
import { ParseOptionalEnumPipe } from './ParseOptionalEnum.pipe';

enum TestEnum {
  test1 = 'TEST1',
  test2 = 'TEST2',
}

describe('userDecorator', () => {
  let parseOptionalEnumPipe: ParseOptionalEnumPipe<typeof TestEnum>;

  beforeAll(async () => {
    parseOptionalEnumPipe = new ParseOptionalEnumPipe(TestEnum);
  });

  it('should validate the enum and return the same value', async () => {
    const result = parseOptionalEnumPipe.transform('TEST1', { type: 'query' });

    expect(result).toEqual('TEST1');
    expect(result).toEqual(TestEnum.test1);
  });

  it('should throw error if enum is not valid', async () => {
    try {
      parseOptionalEnumPipe.transform('Invalid', { type: 'query' });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toContain('Invalid value');
    }
  });

  it('should do nothing if no argument is passed in enum', async () => {
    const result = parseOptionalEnumPipe.transform(null, { type: 'query' });
    expect(result).toBeNull();
  });
});
