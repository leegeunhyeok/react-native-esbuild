import type {
  BaseTransformContext,
  TransformStep,
  TransformContext,
} from '../types';

export abstract class TransformPipeline<Step extends TransformStep<unknown>> {
  protected steps: Step[] = [];

  constructor(protected baseContext: BaseTransformContext) {}

  public addStep(step: Step): this {
    this.steps.push(step);
    return this;
  }

  abstract transform(
    code: string,
    context: Omit<TransformContext, keyof BaseTransformContext>,
  ): ReturnType<Step>;
}
