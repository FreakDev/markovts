import { Game, Memory, Policy, Episode } from './types'
import { play, train } from './tasks';

class Markov<A, G, M> {
  constructor (
    public game: Game<A, G>,
    public gameState: G,
    public memory: Memory<A, G, M>,
    public memoryState: M,
    public movePolicy: Policy<A>,
    public learnPolicy: Policy<A>,
    public playPolicy: Policy<A>,
  ) {}
  train (n: number, alpha: number, gamma: number): Markov<A, G, M> {
    const trainment = train(
      alpha, gamma,
      this.game, this.gameState,
      this.memory, this.memoryState,
      this.movePolicy,
      this.learnPolicy,
    );

    for (let i = 0; i < n; i += 1) {
      this.memoryState = trainment.next().value;
    } return this;
  }
  play (cb: (e: Episode<A, G>) => void): Markov<A, G, M> {
    cb(play(
      this.game, this.gameState,
      this.memory, this.memoryState,
      this.playPolicy,
    ));
    return this;
  }
}

export default <A, G, M>({
  game: { game, initialState },
  memory: { memory, memoryState },
  policies: { move, learn = undefined, show = undefined }
}: {
  game: { game: Game<A, G>, initialState: any}
  memory: { memory: Memory<A, G, M>, memoryState: any}
  policies: { move: Policy<A>, learn?:Policy<A>, show?:Policy<A>}
}) => {
  if (learn === undefined)
    learn = move

  if (show === undefined)
    show = learn

  return new Markov(game, initialState, memory, memoryState, move, learn, show)
}
