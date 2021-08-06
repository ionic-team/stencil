import type * as d from '../../../declarations';
import { normalizePath, unique } from '@utils';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';

export const parseStaticMixins = (staticMembers: ts.ClassElement[], moduleFile: d.Module) => {
  const parsedMixins: string[] = getStaticValue(staticMembers, 'mixinFilePaths');
  if (!parsedMixins || parsedMixins.length === 0) {
    return [];
  }

  const mixinPaths = parsedMixins.map((mixinUrl) => normalizePath(mixinUrl));
  moduleFile.mixinFilePaths = unique([...moduleFile.mixinFilePaths, ...mixinPaths]);
  moduleFile.localImports = unique([...moduleFile.localImports, ...mixinPaths]);

  return mixinPaths;
};
