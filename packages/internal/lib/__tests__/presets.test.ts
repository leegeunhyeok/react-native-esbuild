import { getAssetRegistrationScript } from '../presets';

describe('getAssetRegistrationScript', () => {
  let assetRegistrationScript: string;

  beforeEach(() => {
    assetRegistrationScript = getAssetRegistrationScript({
      name: 'image',
      type: 'png',
      scales: [1, 2, 3],
      hash: 'hash',
      httpServerLocation: '/image.png',
      dimensions: {
        width: 0,
        height: 0,
      },
    });
  });

  it('should match snapshot', () => {
    expect(assetRegistrationScript).toMatchSnapshot();
  });
});
