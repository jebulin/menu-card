import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/shared/roles.enum';


export const RolesAllowed = (...roles: Roles[]) => SetMetadata('roles', roles);