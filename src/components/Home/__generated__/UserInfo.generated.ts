import * as Types from '../../../__generated__/schema.generated';

export type UserInfo_User = { __typename?: 'User', id: string, username: string };

export type UserInfoLogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type UserInfoLogoutMutation = { __typename?: 'Mutation', logout: Types.Result };
