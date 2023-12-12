import EventEmitter from 'node:events';
import type { HMRTransformResult } from '@react-native-esbuild/hmr';
import type { AdditionalData, BuildStatus } from '@react-native-esbuild/shared';
import type { ClientLogEvent } from '@react-native-esbuild/internal';

export class BundlerEventEmitter extends EventEmitter {
  addListener: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  removeEventListener: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  on: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  off: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  emit: <EventType extends BundlerEventType>(
    type: EventType,
    payload: BundlerEventPayload[EventType],
  ) => boolean;
}

export type BundlerEventType =
  | 'build-start'
  | 'build-end'
  | 'build-status-change'
  | 'report';

export type BundlerEventListener<EventType extends BundlerEventType> = (
  payload: BundlerEventPayload[EventType],
) => void;

export interface BundlerEventPayload {
  'build-start': {
    id: number;
    additionalData?: AdditionalData;
  };
  'build-end': {
    id: number;
    revisionId: string;
    update: HMRTransformResult | null;
    additionalData?: AdditionalData;
  };
  'build-status-change': BuildStatus & {
    id: number;
    additionalData?: AdditionalData;
  };
  report: ClientLogEvent;
}
