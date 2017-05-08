
export interface IAnimation {
  play: (opts: PlayOptions) => void;
  stop: (stepValue?: number) => void;
  onFinish: (callback: Function, onceTimeCallback?: boolean) => void;
  whenReady: (callback: Function) => void;
}

export interface AnimationOptions {
  animation?: string;
  duration?: number;
  easing?: string;
  direction?: string;
  isRTL?: boolean;
  ev?: any;
}

export interface PlayOptions {
  duration?: number;
}

export interface EffectProperty {
  effectName: string;
  trans: boolean;
  wc?: string;
  toEffect?: EffectState;
  fromEffect?: EffectState;
}

export interface EffectState {
  val: any;
  num: number;
  effectUnit: string;
}
