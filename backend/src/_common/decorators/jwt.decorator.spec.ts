import { JwtDecorator } from './jwt.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ForbiddenException } from '@nestjs/common';

describe('userDecorator', () => {
  let jwtDecorator: any;

  beforeAll(async () => {
    class DummyClass {
      dummyFunction(@JwtDecorator() value) {
        return value;
      }
    }
    const args = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      DummyClass,
      'dummyFunction',
    );
    jwtDecorator = args[Object.keys(args)[0]].factory;
  });

  it('should decode a jwt passed in a cookie with valid signature', async () => {
    const tokenResponse = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJyZW5hbiIsImxhc3RuYW1lIjoicmVuYW4iLCJlbWFpbCI6InJlbmFuLmRhc2lsdmFkZXNpcXVlaXJhQG1vZGlzLmNvbSIsInJvbGUiOnsiaWQiOjEsImNyZWF0ZWRBdCI6IjIwMjItMDQtMjZUMTM6MTg6MDguODE5WiIsInVwZGF0ZWRBdCI6IjIwMjItMDQtMjhUMTI6NDg6MzcuMDAwWiIsImRlbGV0ZWRBdCI6bnVsbCwibmFtZSI6InJvbGVkMzU5In0sImlhdCI6MTY1MTU2Njk1NywiZXhwIjoxNjUxNTcwNTU3fQ.uMD2mlaaHuVl6MUkrxnetE_olXBGq37Lv-22ljPMkNc',
    };
    const mockCtx = {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              cookies: { jwt: tokenResponse },
            };
          },
        };
      },
    };

    const result: any = jwtDecorator(null, mockCtx);

    expect(result.firstname).toEqual('renan');
    expect(result.lastname).toEqual('renan');
    expect(result.email).toEqual('renan.dasilvadesiqueira@modis.com');
    expect(result.role?.id).toEqual(1);
  });

  it('should decode a jwt passed in a cookie even with invalid signature', async () => {
    const tokenResponse = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJKb2huIiwibGFzdG5hbWUiOiJEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImVtYWlsIjoiam9obkBlbWFpbC5jb20iLCJyb2xlIjp7ImlkIjoxfX0.7nMuY9GxbcLfpO80SnD4sdxeapRhVnvWjoonXCD7rGA',
    };
    const mockCtx = {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              cookies: { jwt: tokenResponse },
            };
          },
        };
      },
    };

    const result: any = jwtDecorator(null, mockCtx);

    expect(result.firstname).toEqual('John');
    expect(result.lastname).toEqual('Doe');
    expect(result.email).toEqual('john@email.com');
    expect(result.role?.id).toEqual(1);
  });

  it('should throw an error if jwt cookie is not present', async () => {
    const mockCtx = {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              cookies: {},
            };
          },
        };
      },
    };

    try {
      jwtDecorator(null, mockCtx);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toContain('JWT not found');
    }
  });

  it('should throw an error if jwt cookie does not have an access token', async () => {
    const mockCtx = {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              cookies: { jwt: {} },
            };
          },
        };
      },
    };

    try {
      jwtDecorator(null, mockCtx);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toContain('JWT not found');
    }
  });
});
