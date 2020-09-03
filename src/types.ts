export type Game<A, G> = {
  actions: (state:G) => Array<A>,
  act: (state:G, action:A) => G,
  reward: (state: G, prevState: G) => number,
  final: (state: G) => boolean,
}

export type Memory<A, G, M> = {
  update: (memoryState: M, gameState: G, action: A, fn:(n:number) => number ) => M,
  rater: (memoryState: M, gameState: G) => (action: A) => number,
};

export type Transition<A, G> = {
  gameState: G,
  nextGameState: G,
  action: A,
  reward: number,
};

export type Policy <A> = (
  actions: Array <A>,
  rater: (action: A) => number
) => A;

export type Move<A, G, M> = (
  game: Game<A, G>, 
  state: G,
  memory: Memory<A, G, M>, 
  memoryState: M,
  policy: Policy<A>,
) => Transition<A, G>;

export type Learn<A, G, M> = (
  game: Game<A, G>,
  transition: Transition<A, G>,
  memory: Memory<A, G, M>, 
  memoryState: M,
  policy: Policy<A>,
) => M;

export type Episode<A, G> = Iterator<Transition<A, G>>;
export type Trainment<M> = Iterator<M>;
