export interface Frame {
  file: string;
  lineNumber: number;
  column: number;
  methodName: string;
}

export interface ConfiguredFrame extends Frame {
  __collapse?: boolean;
}

export interface CodeFrame {
  content: string;
  location: {
    column: number;
    row: number;
  };
  fileName: string;
}

export interface SymbolicateResult {
  stack: ConfiguredFrame[];
  codeFrame: CodeFrame | null;
}
