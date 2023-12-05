import type {
  IEventer,
  ICanvasMarkBoard,
  IEventListener,
  IObject,
  IEventListenerId,
  IFunction,
} from "../types";

type IEventerModule = IEventer & ThisType<ICanvasMarkBoard>;

export const Eventer: IEventerModule = {
  _events: Object.create(null),
  on(type: string, listener: IEventListener) {
    if (!this._events[type]) {
      this._events[type] = [listener];
      return;
    }
    this._events[type].push(listener);
  },
  on_(
    type: string,
    listener: IEventListener,
    bind?: IObject
  ): IEventListenerId {
    if (bind) listener = listener.bind(bind);
    this.on(type, listener);
    return { type, listener };
  },
  off(type: string, listener: IFunction) {
    if (this._events[type]) {
      this._events[type] = this._events[type].filter((item: IFunction) => {
        return item !== listener;
      });
    }
  },
  off_(id: IEventListenerId | IEventListenerId[]): void {
    if (!id) return;
    const list = id instanceof Array ? id : [id];
    list.forEach((item) => this.off(item.type, item.listener));
    list.length = 0;
  },
  emit(name, ...args) {
    if (this._events[name]) {
      this._events[name].forEach((fn: IFunction) => fn.call(this, ...args));
    }
  },
};
