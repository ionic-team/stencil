import * as d from './index';


export interface TranspileResults {
  sourceFilePath?: string;
  code?: string;
  map?: any;
  diagnostics?: d.Diagnostic[];
  cmpMeta?: d.ComponentMeta;
}
