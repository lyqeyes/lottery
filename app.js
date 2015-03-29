
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/namelist',function(req,res){
    var all = Number(req.body.all);
    var target = Number(req.body.target);
    res.render('names.jade',{all:all, targetNum:target});
    //res.redirect('/names')(all);
});
//参数列表: (随机数范围, 已经生成的随机数数组)
function randomList(x,arrNow)
{
    var repeate = 0;
    var seed;
    while(true)
    {
        repeate = 0;
        seed = Math.floor(Math.random()*(x-1)+1);
        for(var item in arrNow)
        {
            if(seed == arrNow[item])
            {
                repeate = 1;
                //break;
            }
            console.log('+1');
        }
        if(repeate)
            continue;
        else
            break;
    }
    console.log('success');
    return seed;
}

app.post('/result',function(req,res){
    var len = Object.getOwnPropertyNames(req.body.namelist).length;   //获取对象的属性个数.
    console.log(len);
    var nameArr = new Array(len); //定义一个和属性个数相等数组, 用来记录属性值
    var count = 0;
    var seeds = new Array(req.body.target);   //根据要的人数申请数组, 用于记录产生的结果
    for(var item in seeds)    //先全部赋值-1
        seeds[item] = -1;

    //不重复的随机数组
    for(var i = 0; i < req.body.target; i++)
    {
        var seed;
        var repeat = 0;
        while(true)
        {
            repeat = 0;   //擦擦擦  又是忘了每次赋初值
            seed = ( Math.floor(Math.random()*len+1) )%len;
            for(var j = 0; j < req.body.target; j++)
            {
                if(seeds[j] == seed)
                {
                    repeat = 1;        //repeat 一直等于1 擦擦擦!
                    break;
                }
            }
            if(repeat == 0)
                break;
            else
                continue;
        }
        seeds[i] = seed;
    }
    for(var item in req.body.namelist)
    {
        nameArr[count] = req.body.namelist[item];   //变长读取属性值, 赋值给nameArr数组.
        count++;
    }
    //res.send(req.body.target);
    var result = new Array(req.body.target);
    var count = 0;

    for(var seed in seeds)
        for(var i = 0; i < len; i++)
        {
            if(seeds[seed] == i)
            {
                result[count] = nameArr[i];
                count++;
                break;
            }
        }
    res.render('result.jade',{result:result});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
