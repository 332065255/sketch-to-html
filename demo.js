var go = require('./index');
var utils = require('./util');
utils.isH5=true;
utils.isReact = true;
utils.minWidthforPC = 1200;
go('./推广通app.sketch',()=>{
    console.log('success');
})
//2html_Animation