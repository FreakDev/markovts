import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as policies from '../src/policies';

describe('policies', () => {
  const actions = ['A', 'B', 'C'];
  const rater = (rs: any) => (a: any) => rs[a];
  const rates1 = { A: 1, B: 2, C: 3 };
  const rates2 = { A: 3, B: 2, C: 1 };

  const distribution = (n: number, policy: any, rates: any) => Array.from(Array(n).keys()).reduce(
    (prev) => {
      const choice = policy(actions, rater(rates));
      return { ...prev, [choice]: (prev as any)[choice] + 1 };
    }, { A: 0, B: 0, C: 0 },
  );

  it('should be uniform (random)', () => {
    const n = 1000;
    const choices = distribution(n, policies.random, rates1);

    const range = [n / 4, n / 2];
    expect(choices.A).to.be.within(range[0], range[1]);
    expect(choices.B).to.be.within(range[0], range[1]);
    expect(choices.C).to.be.within(range[0], range[1]);
  });

  it('should choose the highest rated action (greedy)', () => {
    const n = 100;
    const choices1 = distribution(n, policies.greedy, rates1);
    const choices2 = distribution(n, policies.greedy, rates2);

    expect(choices1.C).to.equal(n);
    expect(choices2.A).to.equal(n);
  });

  it('should be epsilon random and 1 - epsilon greedy (egreedy)', () => {
    const n = 1000;
    const epsilon = 0.5;
    const choices = distribution(n, policies.egreedy(epsilon), rates1);

    expect(choices.A).to.be.within(n / 8, n / 4);
    expect(choices.B).to.be.within(n / 8, n / 4);
    expect(choices.C).to.be.within(n / 2, n);
  });
});
