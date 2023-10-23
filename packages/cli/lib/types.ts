export interface RawArgv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

export type Command = (argv: RawArgv, subCommand?: string) => Promise<void>;
