import * as Types from '../../../__generated__/schema.generated';

export type RankingQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type RankingQuery = { __typename?: 'Query', ranking?: Array<{ __typename?: 'User', id: string, username: string, numberOfGames: number, wins: number, loses: number, draws: number }> | null };
