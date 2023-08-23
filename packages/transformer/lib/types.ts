export type Transformer<Options> = (
  code: string,
  context: { path: string; root: string },
  customOption?: Options,
) => Promise<string>;
