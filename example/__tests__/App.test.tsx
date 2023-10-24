import { describe, it } from '@jest/globals';
import renderer, { act } from 'react-test-renderer';
import { App } from '../src/App';

describe('App', () => {
  it('renders correctly', async () => {
    await act(() => {
      renderer.create(<App />);
    });
  });
});
