import type {
  BaseTransformContext,
  ScopedTransformContext,
} from '@react-native-esbuild/shared';
import type { TransformStep } from '../types';

export abstract class TransformPipeline<Step extends TransformStep<unknown>> {
  protected steps: Step[] = [];

  constructor(protected baseContext: BaseTransformContext) {}

  public addStep(step: Step): this {
    this.steps.push(step);
    return this;
  }

  abstract transform(
    code: string,
    context: ScopedTransformContext,
  ): ReturnType<Step>;
}
