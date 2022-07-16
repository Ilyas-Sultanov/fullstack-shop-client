type RoleType = 'admin' | 'user' | 'moderator';

interface IRoleDataItem extends Record<string, string> {
    _id: string;
   value: RoleType;
}

export type {
    RoleType,
    IRoleDataItem,
};