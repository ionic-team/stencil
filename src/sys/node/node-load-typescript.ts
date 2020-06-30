import { requireFunc } from '@utils';

export const nodeLoadTypeScript = (typeScriptPath: string) => {
  const nodeModuleId = typeScriptPath || 'typescript';
  return requireFunc(nodeModuleId);
};
