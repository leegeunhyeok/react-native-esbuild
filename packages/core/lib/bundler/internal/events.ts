import EventEmitter from 'node:events';

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
  | 'build-status-change';

export type BundlerEventListener<EventType extends BundlerEventType> = (
  payload: BundlerEventPayload[EventType],
) => void;

export interface BundlerEventPayload {
  'build-start': {
    id: number;
  };
  'build-end': {
    id: number;
    revisionId: string;
  };
  'build-status-change': {
    id: number;
    resolved: number;
    loaded: number;
  };
}
