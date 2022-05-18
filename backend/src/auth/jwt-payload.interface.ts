import { Role } from '../users/enum/role.enum';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: Role;
}
