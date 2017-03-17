// import { parseComponentDecorator } from '../parser';


// describe('parser', () => {

//   describe('parseComponentDecorator', () => {

//     it('should get Component with template url and tag above', () => {
//       const str = `
//         @Component({
//           tag: 'page-home',
//           templateUrl: 'home.html'
//         })
//       `;

//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('home.html');
//     });

//     it('should get Component with template url and selector below', () => {
//       const str = `
//         @Component({
//           templateUrl: 'home.html',
//           selector: 'page-home
//         })
//       `;

//       const match = parseComponentDecorator(str);
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

//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('c:\\some\windows\path.ts');
//     });

//     it('should get Component with template url and spaces', () => {
//       const str = '  @Component  (  {  templateUrl  :  `  hi  `  }  )  ';
//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component with template url and back-ticks', () => {
//       const str = '@Component({templateUrl:`hi`})';
//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component with template url and double quotes', () => {
//       const str = '@Component({templateUrl:"hi"})';
//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component with template url and single quotes', () => {
//       const str = '@Component({templateUrl:\'hi\'})';
//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get empty string for Component without string for templateUrl', () => {
//       const str = '@Component({templateUrl:someVar})';
//       const match = parseComponentDecorator(str);
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
//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('hi.html');
//       expect(match.tag).toEqual('ion-button');
//       expect(match.template).toEqual('<div>hi</div>');
//     });

//     it('should get Component templateUrl', () => {
//       const str = '@Component({templateUrl:"hi"})';
//       const match = parseComponentDecorator(str);
//       expect(match.templateUrl).toEqual('hi');
//     });

//     it('should get Component template', () => {
//       const str = '@Component({template:"hi"})';
//       const match = parseComponentDecorator(str);
//       expect(match.template).toEqual('hi');
//     });

//     it('should get Component tag', () => {
//       const str = '@Component({tag:"hi"})';
//       const match = parseComponentDecorator(str);
//       expect(match.tag).toEqual('hi');
//     });

//     it('should get Component deprecated selector and set as tag', () => {
//       const str = '@Component({selector:"hi"})';
//       const match = parseComponentDecorator(str);
//       expect(match.tag).toEqual('hi');
//     });

//   });

// });
