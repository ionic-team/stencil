// import { parseComponentSourceText, getComponentMatch } from '../parser';


// describe('parser', () => {

//   describe('parseComponentSourceText', () => {

//     it('should parse transpiled file', () => {
//       let content = `
//         import { Component, Input } from 'ionic-core';
//         let Button = class Button {
//             constructor() {
//                 console.log('button');
//             }
//             set tabIndex(value) {
//                 console.log('type');
//             }
//         };
//         __decorate([
//             Input()
//         ], Button.prototype, "tabIndex", null);
//         Button = __decorate([
//             Component({
//                 tag: 'ion-button',
//                 templateUrl: 'button.html'
//             })
//         ], Button);
//         export { Button };
//         //# sourceMappingURL=button.js.map
//       `;

//       let p = parseComponentSourceText(content);
//       expect(p.length).toEqual(1);
//       expect(p[0].templateUrl).toEqual('button.html');
//     });

//     it('should get multiple component meta data', () => {
//       let content = `
//         @Component({ templateUrl: './buttonA.html' })
//         export class MyButtonA {}

//         @Component({ templateUrl: './buttonB.html' })
//         export class MyButtonB {}
//         `;
//       let p = parseComponentSourceText(content);
//       expect(p.length).toEqual(2);
//       expect(p[0].templateUrl).toEqual('./buttonA.html');
//       expect(p[1].templateUrl).toEqual('./buttonB.html');
//     });

//     it('should get one component template url', () => {
//       let content = `@Component({ templateUrl: './button.html' })`;
//       let p = parseComponentSourceText(content);
//       expect(p.length).toEqual(1);
//       expect(p[0].templateUrl).toEqual('./button.html');
//     });

//     it('should not parse invalid component meta', () => {
//       let content = `Component Data!!`;
//       let p = parseComponentSourceText(content);
//       expect(p.length).toEqual(0);
//     });

//     it('should return empty array for null', () => {
//       expect(parseComponentSourceText(undefined).length).toEqual(0);
//       expect(parseComponentSourceText('').length).toEqual(0);
//       expect(parseComponentSourceText(null).length).toEqual(0);
//     });

//   });

//   describe('getComponentMatch', () => {

//     it('should get Component with template url and tag above', () => {
//       const str = `
//         @Component({
//           tag: 'page-home',
//           templateUrl: 'home.html'
//         })
//       `;

//       const match = getComponentMatch(str);
//       expect(match.templateUrl).toEqual('home.html');
//     });

//     it('should get Component with template url and selector below', () => {
//       const str = `
//         @Component({
//           templateUrl: 'home.html',
//           selector: 'page-home
//         })
//       `;

//       const match = getComponentMatch(str);
//       expect(match.templateUrl).toEqual('home.html');
//     });

//     it('should get Component with template url, spaces, tabs and new lines', () => {
//       const str = `\t\n\r
//         @Component(
//           {

//             templateUrl :
//               \t\n\r"c:\\some\windows\path.ts"

//           }
//         )
//       `;

//       const match = getComponentMatch(str);
//       expect(match.templateUrl).toEqual('c:\\some\windows\path.ts');
//     });

//     it('should get Component with template url and spaces', () => {
//       const str = '  @Component  (  {  templateUrl  :  `  hi  `  }  )  ';
//       const match = getComponentMatch(str);
//       expect(match.inputText).toEqual('Component  (  {  templateUrl  :  `  hi  `  }  )');
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component with template url and back-ticks', () => {
//       const str = '@Component({templateUrl:`hi`})';
//       const match = getComponentMatch(str);
//       expect(match.inputText).toEqual('Component({templateUrl:`hi`})');
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component with template url and double quotes', () => {
//       const str = '@Component({templateUrl:"hi"})';
//       const match = getComponentMatch(str);
//       expect(match.inputText).toEqual('Component({templateUrl:"hi"})');
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component with template url and single quotes', () => {
//       const str = '@Component({templateUrl:\'hi\'})';
//       const match = getComponentMatch(str);
//       expect(match.inputText).toEqual('Component({templateUrl:\'hi\'})');
//       expect(match.templateUrl).toEqual('hi');
//     });

//     // TODO!!!!
//     // it('should get Component with double quotes around templateUrl', () => {
//     //   const str = `@Component({"templateUrl":"hi"})`;
//     //   const match = getComponentMatch(str);
//     //   expect(match.inputText).toEqual(`Component({"templateUrl":"hi"})`);
//     //   expect(match.templateUrl).toEqual('hi');
//     // });

//     it('should get empty string for Component without string for templateUrl', () => {
//       const str = '@Component({templateUrl:someVar})';
//       const match = getComponentMatch(str);
//       expect(match.templateUrl).toEqual('');
//     });

//     it('should get Component templateUrl', () => {
//       const str = `
//         @Component({
//           templateUrl: "hi.html",
//           tag: 'ion-button',
//           template: "<div>hi</div>"
//         })';
//       `;
//       const match = getComponentMatch(str);
//       expect(match.templateUrl).toEqual('hi.html');
//       expect(match.tag).toEqual('ion-button');
//       expect(match.template).toEqual('<div>hi</div>');
//     });

//     it('should get Component templateUrl', () => {
//       const str = '@Component({templateUrl:"hi"})';
//       const match = getComponentMatch(str);
//       expect(match.data).toEqual('templateUrl:"hi"');
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component template', () => {
//       const str = '@Component({template:"hi"})';
//       const match = getComponentMatch(str);
//       expect(match.data).toEqual('template:"hi"');
//       expect(match.template).toEqual('hi');
//     });

//     it('should get Component tag', () => {
//       const str = '@Component({tag:"hi"})';
//       const match = getComponentMatch(str);
//       expect(match.data).toEqual('tag:"hi"');
//       expect(match.tag).toEqual('hi');
//     });

//     it('should get Component deprecated selector and set as tag', () => {
//       const str = '@Component({selector:"hi"})';
//       const match = getComponentMatch(str);
//       expect(match.data).toEqual('selector:"hi"');
//       expect(match.tag).toEqual('hi');
//     });

//     it('should get null for Component without brackets', () => {
//       const str = '@Component()';
//       const match = getComponentMatch(str);
//       expect(match).toEqual(null);
//     });

//     it('should get null for Component without parentheses', () => {
//       const str = '@Component';
//       const match = getComponentMatch(str);
//       expect(match).toEqual(null);
//     });

//     it('should get null for @Component({})', () => {
//       const str = '@Component({})';
//       const match = getComponentMatch(str);
//       expect(match).toEqual(null);
//     });

//     it('should get null for no Component', () => {
//       const str = 'whatever';
//       const match = getComponentMatch(str);
//       expect(match).toEqual(null);
//     });

//   });

// });
