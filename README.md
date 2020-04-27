# Babel-Plugin-Run-Comment-Code
Run the code in the comments

## Example
```javascript
// begin
// code>>console.log('begin')
let str = 'hello world';
// code>>str = 'Hello World';
console.log(str);

↓ ↓ ↓ ↓ ↓ ↓
//begin
console.log('begin')
let str = 'hello world';
str = 'Hello World';
console.log(str);
```

## Usage
```bash
npm install babel-plugin-run-comment-code -D
```
Via .babelrc or babel-loader
```json
{
    "plugins": ["run-comment-code"]
}
```
## Note
 **It is not recommended to use this plugin in a production environment**, the purpose of this plugin is just for debugging