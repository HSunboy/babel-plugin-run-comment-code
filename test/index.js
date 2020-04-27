const babelCore = require('@babel/core');
const generator = require('@babel/generator').default;
const plugin = require('../src');


const code = `
// begin
// code>>console.log('begin')
function a(){
    // code>> console.log('a')
    // a
    let v = 1;
    // code>> console.log(v)
}
a();
// end
// code>>console.log('end');
`

let ast = babelCore.transform(code, { plugins: [plugin]});
console.log(ast.code)