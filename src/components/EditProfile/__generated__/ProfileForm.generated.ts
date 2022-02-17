import * as Types from '../../../__generated__/schema.generated';

export type ProfileForm_User = { __typename?: 'User', id: string, username: string };

export type ProfileFormMutationVariables = Types.Exact<{
  input: Types.EditUserInput;
}>;


export type ProfileFormMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, username: string } };
