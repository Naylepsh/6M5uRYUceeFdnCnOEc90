import { hash, compare } from './hashing';

describe('hashing utility', () => {
  const plainText = 'some text';

  it('should return a different string than the one passed', async () => {
    const hashed = await hash(plainText);

    expect(hashed).not.toBe(plainText);
  });

  it('should successfully compare data and its hashed version', async () => {
    const hashed = await hash(plainText);

    const res = await compare(plainText, hashed);

    expect(res).toBe(true);
  });

  it('should successfully compare text to its multiple hashes done at different times', async () => {
    const firstHash = await hash(plainText);
    const secondHash = await hash(plainText);

    const firstComparison = await compare(plainText, firstHash);
    const secondComparison = await compare(plainText, secondHash);

    expect(firstComparison).toBe(true);
    expect(secondComparison).toBe(true);
  });
});
