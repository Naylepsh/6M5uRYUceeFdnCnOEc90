import { UserPassword } from './user.password';

describe('User Password Value Object', () => {
  const props = { value: 'some-plain-text' };

  describe('creation', () => {
    it('should return a hashed password', async () => {
      const password = await UserPassword.create(props);

      expect(password.value).not.toBe(props.value);
    });
  });

  it('should successfully compare data and its hashed version', async () => {
    const password = await UserPassword.create(props);

    const res = await password.comparePassword(props.value);

    expect(res).toBe(true);
  });

  it('should successfully compare text to its multiple hashes done at different times', async () => {
    const firstPassword = await UserPassword.create(props);
    const secondPassword = await UserPassword.create(props);

    const firstComparison = await firstPassword.comparePassword(props.value);
    const secondComparison = await secondPassword.comparePassword(props.value);

    expect(firstComparison).toBe(true);
    expect(secondComparison).toBe(true);
  });
});
