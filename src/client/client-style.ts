import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const registerStyle = (styleId: string, styleText: string) => styles.set(styleId, styleText);
