import { Diagnostic } from './diagnostics';


export interface OptimizeCssInput {
  css: string;
  filePath: string;
  autoprefixer: any;
  minify: boolean;
  legecyBuild: boolean;
}


export interface OptimizeCssOutput {
  css: string;
  diagnostics?: Diagnostic[];
}
