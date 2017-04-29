import { Side } from '../../util/interfaces';


export interface Menu {

  setOpen(shouldOpen: boolean, animated: boolean): Promise<boolean>;
  open(): Promise<boolean>;
  close(): Promise<boolean>;
  toggle(): Promise<boolean>;
  enable(shouldEnable: boolean, menuId?: string): Menu;
  swipeEnable(shouldEnable: boolean): Menu;
  isOpen: boolean;
  enabled: boolean;
  side: Side;
  id: string;
  isRightSide: boolean;

  ionDrag: Function;
  ionOpen: Function;
  ionClose: Function;

  isAnimating(): boolean;
  width(): number;
  getContentElement(): HTMLElement;
  getMenuElement(): HTMLElement;
  getBackdropElement(): HTMLElement;
  _canOpen(): boolean;
  persistent: boolean;
}


export interface MenuType {
  ani: any;
  isOpening: boolean;
  setOpen(shouldOpen: boolean, animated: boolean, done: Function): void;
  setProgressStart(isOpen: boolean): void;
  setProgessStep(stepValue: number): void;
  setProgressEnd(shouldComplete: boolean, currentStepValue: number, velocity: number, done: Function): void;
  destroy(): void;
}
