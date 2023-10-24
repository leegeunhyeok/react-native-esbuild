import type { OnLoadArgs } from 'esbuild';
import type { TransformStep } from '../types';

export abstract class TransformPipeline<Step extends TransformStep<unknown>> {
  protected steps: Step[] = [];
  protected onBeforeTransform?: Step;
  protected onAfterTransform?: Step;

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
