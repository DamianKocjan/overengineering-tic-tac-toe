import * as Types from '../../../__generated__/schema.generated';

export type PlayQueryVariables = Types.Exact<{
  gameId: Types.Scalars['ID'];
}>;


export type PlayQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string } | null, game: { __typename?: 'Game', id: string, xPlayerId: string, oPlayerId: string, winnerId: string, loserId: string, isDraw: boolean, players: Array<{ __typename?: 'User', id: string, username: string }>, moves: Array<{ __typename?: 'Move', position: number, playerId: string }> } };
