import { OutputTargetBase } from '../../../declarations';

export interface OutputTargetAngular extends OutputTargetBase {
  type: 'angular';

  componentCorePackage?: string;
  directivesProxyFile?: string;
  directivesArrayFile?: string;
  directivesUtilsFile?: string;
  excludeComponents?: string[];
}
