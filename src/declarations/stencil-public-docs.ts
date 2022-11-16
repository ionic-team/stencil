export interface JsonDocs {
  components: JsonDocsComponent[];
  timestamp: string;
  compiler: {
    name: string;
    version: string;
    typescriptVersion: string;
  };
}

export interface JsonDocsComponent {
  dirPath?: string;
  fileName?: string;
  filePath?: string;
  readmePath?: string;
  usagesDir?: string;
  encapsulation: 'shadow' | 'scoped' | 'none';
  tag: string;
  readme: string;
  docs: string;
  docsTags: JsonDocsTag[];
  /**
   * The text from the class-level JSDoc for a Stencil component, if present.
   */
  overview?: string;
  usage: JsonDocsUsage;
  props: JsonDocsProp[];
  methods: JsonDocsMethod[];
  events: JsonDocsEvent[];
  listeners: JsonDocsListener[];
  styles: JsonDocsStyle[];
  slots: JsonDocsSlot[];
  parts: JsonDocsPart[];
  dependents: string[];
  dependencies: string[];
  dependencyGraph: JsonDocsDependencyGraph;
  deprecation?: string;
}

export interface JsonDocsDependencyGraph {
  [tagName: string]: string[];
}

export interface JsonDocsTag {
  name: string;
  text?: string;
}

export interface JsonDocsValue {
  value?: string;
  type: string;
}

/**
 * A mapping of file names to their contents.
 *
 * This type is meant to be used when reading one or more usage markdown files associated with a component. For the
 * given directory structure:
 * ```
 * src/components/my-component
 * ├── my-component.tsx
 * └── usage
 *     ├── bar.md
 *     └── foo.md
 * ```
 * an instance of this type would include the name of the markdown file, mapped to its contents:
 * ```ts
 * {
 *   'bar': STRING_CONTENTS_OF_BAR.MD
 *   'foo': STRING_CONTENTS_OF_FOO.MD
 * }
 * ```
 */
export interface JsonDocsUsage {
  [key: string]: string;
}

export interface JsonDocsProp {
  name: string;
  type: string;
  mutable: boolean;
  /**
   * The name of the attribute that is exposed to configure a compiled web component
   */
  attr?: string;
  reflectToAttr: boolean;
  docs: string;
  docsTags: JsonDocsTag[];
  default: string;
  deprecation?: string;
  values: JsonDocsValue[];
  optional: boolean;
  required: boolean;
  getter: boolean;
  setter: boolean;
}

export interface JsonDocsMethod {
  name: string;
  docs: string;
  docsTags: JsonDocsTag[];
  deprecation?: string;
  signature: string;
  returns: JsonDocsMethodReturn;
  parameters: JsonDocMethodParameter[];
}

export interface JsonDocsMethodReturn {
  type: string;
  docs: string;
}

export interface JsonDocMethodParameter {
  name: string;
  type: string;
  docs: string;
}

export interface JsonDocsEvent {
  event: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  docs: string;
  docsTags: JsonDocsTag[];
  deprecation?: string;
  detail: string;
}

export interface JsonDocsStyle {
  name: string;
  docs: string;
  annotation: string;
}

export interface JsonDocsListener {
  event: string;
  target?: string;
  capture: boolean;
  passive: boolean;
}

export interface JsonDocsSlot {
  name: string;
  docs: string;
}

export interface JsonDocsPart {
  name: string;
  docs: string;
}

export interface StyleDoc {
  name: string;
  docs: string;
  annotation: 'prop';
}
