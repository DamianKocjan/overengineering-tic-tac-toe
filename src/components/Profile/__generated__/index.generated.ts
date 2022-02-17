import * as Types from '../../../__generated__/schema.generated';

export type ProfileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ProfileQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, username: string, numberOfGames: number, wins: number, loses: number, draws: number } };
