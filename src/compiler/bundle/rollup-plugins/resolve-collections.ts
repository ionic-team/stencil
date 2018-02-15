import { CompilerCtx } from '../../../declarations';
import { Plugin } from 'rollup';


export default function resolveCollections(compilerCtx: CompilerCtx) {
  // and by "resolve collections", we mean
  // completely ignore the entry module for collections
  // basically it's the collection's loader.js file which
  // is useful for npm and cdns, but not useful in this
  // case. Specifically for a stencil build, we can safely
  // ignore the entry module (loader) for a stencil collection
  // because this build comes with its very own freshly built loader

  return {
    name: 'resolveCollections',

    resolveId(importee) {
      const isStencilCollection = compilerCtx.collections.some(c => c.collectionName === importee);

      if (isStencilCollection) {
        return COLLECTION_ID;
      }

      return null;
    },

    load(id) {
      if (id === COLLECTION_ID) {
        // already determined this is a stencil collection
        // we don't want its content, let's clear it out
        return '';
      }
      return null;
    },

    async transform(_sourceText, id) {
      if (id === COLLECTION_ID) {
        // just to save other plugins from
        // wasting their time here
        return '';
      }
      return null;
    }

  } as Plugin;
}

const COLLECTION_ID = '#collection#';
