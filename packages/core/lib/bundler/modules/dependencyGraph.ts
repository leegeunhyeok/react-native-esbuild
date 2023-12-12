import { DependencyGraph } from 'esbuild-dependency-graph';
import type { Metafile } from 'esbuild';

export const generateDependencyGraph = (
  metafile: Metafile,
  entryPoint: string,
): DependencyGraph => {
  return new DependencyGraph(metafile, entryPoint);
};
