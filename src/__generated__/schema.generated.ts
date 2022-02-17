export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: string;
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

export type EditUserInput = {
  username?: InputMaybe<Scalars['String']>;
};

export type Game = {
  __typename?: 'Game';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isDraw: Scalars['Boolean'];
  loserId: Scalars['String'];
  moves: Array<Move>;
  oPlayerId: Scalars['String'];
  players: Array<User>;
  updatedAt: Scalars['DateTime'];
  winnerId: Scalars['String'];
  xPlayerId: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Move = {
  __typename?: 'Move';
  createdAt: Scalars['DateTime'];
  game: Game;
  gameId: Scalars['String'];
  id: Scalars['ID'];
  playerId: Scalars['String'];
  position: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Result;
  createGame: Game;
  editUser: User;
  login: User;
  logout: Result;
  signUp: User;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationEditUserArgs = {
  input: EditUserInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type Query = {
  __typename?: 'Query';
  game: Game;
  me?: Maybe<User>;
  move: Move;
  ranking?: Maybe<Array<User>>;
  user: User;
};


export type QueryGameArgs = {
  id: Scalars['ID'];
};


export type QueryMoveArgs = {
  id: Scalars['ID'];
};


export type QueryRankingArgs = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export enum Result {
  Success = 'SUCCESS'
}

export type SignUpInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  draws: Scalars['Int'];
  games: Array<Game>;
  id: Scalars['ID'];
  loses: Scalars['Int'];
  numberOfGames: Scalars['Int'];
  username: Scalars['String'];
  wins: Scalars['Int'];
};


export type UserGamesArgs = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};
