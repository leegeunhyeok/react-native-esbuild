import type { OnLoadArgs } from 'esbuild';
import md5 from 'md5';
import type { TransformStep, TransformerContext } from '../types';

export abstract class TransformPipeline<Step extends TransformStep<unknown>> {
  protected steps: Step[] = [];
  protected onBeforeTransform?: Step;
  protected onAfterTransform?: Step;

  constructor(protected context: Omit<TransformerContext, 'path'>) {}

  /**
   * Generate hash that contains the file path, modification time, and bundle options.
   *
   * `id` is combined(platform, dev, minify) bundle options value in `@react-native-esbuild`.
   *
   * hash = md5(id + modified time + file path)
   *            number + number    + string
   */
  protected getHash(id: number, filepath: string, modifiedAt: number): string {
    return md5(id + modifiedAt + filepath);
  }

  public beforeTransform(onBeforeTransform: Step): this {
    this.onBeforeTransform = onBeforeTransform;
    return this;
  }

  public afterTransform(onAfterTransform: Step): this {
    this.onAfterTransform = onAfterTransform;
    return this;
  }

  public addStep(step: Step): this {
    this.steps.push(step);
    return this;
  }

  abstract transform(code: string, args: OnLoadArgs): ReturnType<Step>;
}
