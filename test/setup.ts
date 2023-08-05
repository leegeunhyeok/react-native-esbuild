beforeAll(() => {
  process.cwd = jest.fn().mockReturnValue('/user');
});
