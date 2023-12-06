import { dashToPascalCase, sortBy, toTitleCase } from '@utils';
export const updateToHydrateComponents = async (cmps) => {
    const hydrateCmps = await Promise.all(cmps.map(updateToHydrateComponent));
    return sortBy(hydrateCmps, (c) => c.cmp.componentClassName);
};
const updateToHydrateComponent = async (cmp) => {
    const cmpData = {
        filePath: cmp.sourceFilePath,
        exportLine: ``,
        cmp: cmp,
        uniqueComponentClassName: ``,
        importLine: ``,
    };
    const pascalCasedClassName = dashToPascalCase(toTitleCase(cmp.tagName));
    if (cmp.componentClassName !== pascalCasedClassName) {
        cmpData.uniqueComponentClassName = pascalCasedClassName;
        cmpData.importLine = `import { ${cmp.componentClassName} as ${cmpData.uniqueComponentClassName} } from '${cmpData.filePath}';`;
    }
    else {
        cmpData.uniqueComponentClassName = cmp.componentClassName;
        cmpData.importLine = `import { ${cmpData.uniqueComponentClassName} } from '${cmpData.filePath}';`;
    }
    return cmpData;
};
//# sourceMappingURL=update-to-hydrate-components.js.map