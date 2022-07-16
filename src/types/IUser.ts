interface IUser {
    _id: string
    name: string
    email: string
    roles: string[]
    isActivated: boolean
    createdAt: string
};

export default IUser;