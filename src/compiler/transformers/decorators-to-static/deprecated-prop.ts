import ts from 'typescript';
import { GET_CONNECT, GET_CONTEXT } from '../exports';

export function transformContextProp(prop: ts.PropertyDeclaration, context: string, newMembers: ts.ClassElement[]) {
  replace(prop, GET_CONTEXT, context, newMembers);
}

export function transformConnectProp(prop: ts.PropertyDeclaration, connect: string, newMembers: ts.ClassElement[]) {
  replace(prop, GET_CONNECT, connect, newMembers);
}

function replace(prop: ts.PropertyDeclaration, functionName: string, arg: string, newMembers: ts.ClassElement[]) {
  const memberIndex = newMembers.findIndex(m => m === prop);
  newMembers[memberIndex] = ts.createProperty(
    undefined,
    undefined,
    prop.name.getText(),
    undefined,
    undefined,
    ts.createCall(
      ts.createIdentifier(functionName),
      undefined,
      [
        ts.createLiteral(arg),
        ts.createThis()
      ]
    )
  );
}
