/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
import type * as d from '../../declarations';
export declare const h: (nodeName: any, vnodeData: any, ...children: d.ChildType[]) => d.VNode;
/**
 * A utility function for creating a virtual DOM node from a tag and some
 * possible text content.
 *
 * @param tag the tag for this element
 * @param text possible text content for the node
 * @returns a newly-minted virtual DOM node
 */
export declare const newVNode: (tag: string, text: string) => d.VNode;
export declare const Host: {};
/**
 * Check whether a given node is a Host node or not
 *
 * @param node the virtual DOM node to check
 * @returns whether it's a Host node or not
 */
export declare const isHost: (node: any) => node is d.VNode;
