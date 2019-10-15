
export enum SessionStorageKeys {
    KeyCloakToken = 'KEYCLOAK_TOKEN',
    KeyCloakRefreshToken = 'KEYCLOAK_REFRESH_TOKEN',
    ApiConfigKey = 'AUTH_API_CONFIG',
    BusinessIdentifierKey = 'BUSINESS_IDENTIFIER'
}

export enum AppConstants {
    RootPath = '/auth'
}

export enum Role {
    Staff = 'staff',
    Public = 'public_user',
    Edit = 'edit',
    Basic = 'basic'
}
