import EventEmitter from 'node:events';
import type {
  BundlerAdditionalData,
  BuildStatus,
  ReportableEvent,
} from '../../types';

export class BundlerEventEmitter extends EventEmitter {
  declare addListener: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  declare removeEventListener: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  declare on: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  declare off: <EventType extends BundlerEventType>(
    type: EventType,
    listener: BundlerEventListener<EventType>,
  ) => this;
  declare emit: <EventType extends BundlerEventType>(
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
  'build-start': { id: number; additionalData?: BundlerAdditionalData };
  'build-end': {
    id: number;
    revisionId: string;
    additionalData?: BundlerAdditionalData;
  };
  'build-status-change': BuildStatus & {
    id: number;
    additionalData?: BundlerAdditionalData;
  };
  report: ReportableEvent;
}
