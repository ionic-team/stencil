import ts from 'typescript';
import { updateLazyComponentConstructor } from '../component-lazy/lazy-constructor';
import { addLazyElementGetter } from '../component-lazy/lazy-element-getter';
import { transformHostData } from '../host-data-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { retrieveModifierLike } from '../transform-utils';
import { addWatchers } from '../watcher-meta-transform';
import { addHydrateRuntimeCmpMeta } from './hydrate-runtime-cmp-meta';
export const updateHydrateComponentClass = (classNode, moduleFile, cmp) => {
    return ts.factory.updateClassDeclaration(classNode, retrieveModifierLike(classNode), classNode.name, classNode.typeParameters, classNode.heritageClauses, updateHydrateHostComponentMembers(classNode, moduleFile, cmp));
};
const updateHydrateHostComponentMembers = (classNode, moduleFile, cmp) => {
    const classMembers = removeStaticMetaProperties(classNode);
    updateLazyComponentConstructor(classMembers, classNode, moduleFile, cmp);
    addLazyElementGetter(classMembers, moduleFile, cmp);
    addWatchers(classMembers, cmp);
    addHydrateRuntimeCmpMeta(classMembers, cmp);
    transformHostData(classMembers, moduleFile);
    return classMembers;
};
//# sourceMappingURL=hydrate-component.js.map