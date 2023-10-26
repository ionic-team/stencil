import * as ts from 'typescript'
import {Transformation} from 'ts-codemod'

// my-custom-transformation.ts
export default class MyCustomTransformation extends Transformation {
  visit(node: ts.Node): ts.VisitResult<ts.Node> {
    // write your implementation here
    return node // will apply no-change
  }
}
