import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Adds static "style" getter within the class
 * ```typescript
 * const MyComponent = class {
 *   static get style() { return "styles"; }
 * }
 * ```
 * @param classMembers a class to existing members of a class. **this parameter will be mutated** rather than returning
 * a cloned version
 * @param cmp the metadata associated with the component being evaluated
 * @param commentOriginalSelector if `true`, add a comment with the original CSS selector to the style.
 */
export declare const addStaticStyleGetterWithinClass: (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, commentOriginalSelector: boolean) => void;
/**
 * Adds static "style" property to the class variable.
 *
 * ```typescript
 * const MyComponent = class {}
 * MyComponent.style = "styles";
 * ```
 *
 * @param styleStatements a list of statements containing style assignments to a class
 * @param cmp the metadata associated with the component being evaluated
 */
export declare const addStaticStylePropertyToClass: (styleStatements: ts.Statement[], cmp: d.ComponentCompilerMeta) => void;
