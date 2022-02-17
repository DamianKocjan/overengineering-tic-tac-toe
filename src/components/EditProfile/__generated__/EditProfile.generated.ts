import * as Types from '../../../__generated__/schema.generated';

export type EditProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EditProfileQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };
