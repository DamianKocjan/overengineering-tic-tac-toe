import * as Types from '../../../__generated__/schema.generated';

export type CreateGameVariables = Types.Exact<{ [key: string]: never; }>;


export type CreateGame = { __typename?: 'Mutation', createGame: { __typename?: 'Game', id: string } };
