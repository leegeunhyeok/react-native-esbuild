import 'node-self';

beforeAll(() => {
  process.cwd = jest.fn().mockReturnValue('/user');
});
