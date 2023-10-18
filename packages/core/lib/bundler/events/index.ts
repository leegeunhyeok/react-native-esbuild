import EventEmitter from 'node:events';
import type {
  BundlerAdditionalData,
  BuildStatus,
  ReportableEvent,
  UpdatedModule,
} from '../../types';

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
    additionalData?: BundlerAdditionalData;
  };
  'build-end': {
    id: number;
    revisionId: string;
    updatedModule: UpdatedModule | null;
    additionalData?: BundlerAdditionalData;
  };
  'build-status-change': BuildStatus & {
    id: number;
    additionalData?: BundlerAdditionalData;
  };
  report: ReportableEvent;
}
