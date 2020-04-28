const babelCore = require('@babel/core');
const generator = require('@babel/generator').default;
const plugin = require('../src');


const code = `
// begin
// code>>console.log('begin')
function a(){
    let b = 2;
    // code>> console.log('a');console.log('end2')
    // a
    let v = 1;
    // code>>console.log(v);console.log('end2')
}
a();
// end
// code>>console.log('end');console.log('end2')
`

let ast = babelCore.transform(code, { presets: ['@babel/preset-env'], plugins: [plugin]});
console.log(ast.code)