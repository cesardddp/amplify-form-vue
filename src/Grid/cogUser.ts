
export type cogUser = {
    Username: string
    Attributes: Attribute[]
    UserCreateDate: string
    UserLastModifiedDate: string
    Enabled: boolean
    UserStatus: string
}

export type Attribute = {
    Name: string
    Value: string
}

type cogListUser = {
    Users: cogUser[]
}

export default cogListUser;