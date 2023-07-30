export const isCI = (): boolean =>
  process.env.CI?.toLocaleLowerCase() === 'true' || process.env.CI === '1';
