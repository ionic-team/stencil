import * as d from './index';


export interface TranspileResults {
  code?: string;
  diagnostics?: d.Diagnostic[];
  cmpMeta?: d.ComponentMeta;
}
