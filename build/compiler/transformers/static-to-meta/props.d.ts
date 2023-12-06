import ts from 'typescript';
import type * as d from '../../../declarations';
/**
 * Parse a list of {@link ts.ClassElement} objects representing static props
 * into a list of our own Intermediate Representation (IR) of properties on
 * components.
 *
 * @param staticMembers TypeScript IR for the properties on our component
 * @returns a manifest of compiler properties in our own Stencil IR
 */
export declare const parseStaticProps: (staticMembers: ts.ClassElement[]) => d.ComponentCompilerProperty[];
