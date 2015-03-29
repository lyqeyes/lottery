
/*
 * GET home page.
 */

exports.index = function(req, res){             //其实就是相当于将这个函数赋值给前面的变量 然后再在app.js中调用它
  res.render('index', { title: '狼多肉少摇号系统' });
};