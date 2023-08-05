import { getDevServerAssetPath } from '../server';

describe('getDevServerAssetPath', () => {
  it('should match snapshot', () => {
    expect(getDevServerAssetPath()).toMatchSnapshot();
  });
});
