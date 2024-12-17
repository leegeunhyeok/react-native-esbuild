declare module 'hermes-parser' {
  import type { Node } from '@babel/core';

  interface HermesParserOptions {
    babel?: boolean;
    allowReturnOutsideFunction?: boolean;
    flow?: 'all' | 'detect';
    sourceFilename?: string | null;
    sourceType?: 'module' | 'script' | 'unambiguous';
    tokens?: boolean;
  }

  /**
   * Returns `Node` when call with `babel: true` option.
   */
  type MaybeBabelAstNode = Node;

  interface HermesParser {
    parse: (code: string, options: HermesParserOptions) => MaybeBabelAstNode;
  }

  declare function parse(
    code: string,
    options: HermesParserOptions,
  ): MaybeBabelAstNode;

  export const parse;
}
