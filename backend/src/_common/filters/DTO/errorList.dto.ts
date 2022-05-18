import { Expose } from 'class-transformer';

export class ErrorListDto {
  @Expose()
  message: string;

  @Expose()
  name: string;

  @Expose()
  stack?: string | ErrorStack;
}

export class ErrorStack {
  @Expose()
  status: string;
  @Expose()
  origin: string;
  @Expose()
  value: any;
}

export class ErrorDto {
  @Expose()
  statusCode: number;

  @Expose()
  status: string;

  @Expose()
  error: ErrorListDto[];

  @Expose()
  stack?: ErrorStack;
}
