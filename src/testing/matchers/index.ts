import { toEqualAttribute, toEqualAttributes, toHaveAttribute } from './attributes';
import { toHaveReceivedEvent, toHaveReceivedEventDetail, toHaveReceivedEventTimes } from './events';
import { toEqualHtml } from './html';
import { toEqualText } from './text';
import { toHaveClass, toHaveClasses, toMatchClasses } from './class-list';
import { toMatchScreenshot } from './screenshot';


export const expectExtend = {
  toEqualAttribute,
  toEqualAttributes,
  toEqualHtml,
  toEqualText,
  toHaveAttribute,
  toHaveClass,
  toHaveClasses,
  toMatchClasses,
  toHaveReceivedEvent,
  toHaveReceivedEventDetail,
  toHaveReceivedEventTimes,
  toMatchScreenshot
};
