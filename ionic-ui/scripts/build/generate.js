const path = require('path');
const compiler = require('../../../ionic-core/dist/es2015/compiler/index');


// compiler.compileFile(path.join(__dirname, '../../'))

let filePath = 'asdf'
let sourceText = `
@Component({
  selector: 'ion-button',
  template: '<div>hi</div>'
})
export class MyButton{}
`


// var asdf = compiler.parseComponentDecorator(content)
// console.log(asdf)


var out = compiler.compileSourceText(sourceText).then(components => {
  console.log(components)
});


