export class UserDto {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    password: string;
    createdBy?: number;
    createdAt?: string;
    updatedBy?: number;
    updatedAt?: string;
    status?: number;
}
