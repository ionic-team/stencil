// TODO(STENCIL-659): Remove code implementing the CSS variable shim
export const VAR_USAGE_START = /\bvar\(/;
export const VAR_ASSIGN_START = /\B--[\w-]+\s*:/;

export const COMMENTS = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim;
export const TRAILING_LINES = /^[\t ]+\n/gm;
