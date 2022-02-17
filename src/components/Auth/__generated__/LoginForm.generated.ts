import * as Types from '../../../__generated__/schema.generated';

export type LoginFormMutationVariables = Types.Exact<{
  input: Types.LoginInput;
}>;


export type LoginFormMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string } };
