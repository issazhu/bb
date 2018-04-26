var express = require('express');
var crypto = require('crypto');
var userModel = require("../models/userModel.js");
var postModel = require("../models/postModel.js");
//const UserModel = require(path.resolve('./app_server/models/users.js'));
//var User = require(path.resolve('./app_server/models/link.js'));
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: '主页',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/reg', checkNotLogin, function (req, res, next) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/reg', checkNotLogin, function (req, res, next) {
  var md5 = crypto.createHash('md5');

  //生成密码的 md5 值
  //password = md5.update(req.body.password).digest('hex');
  var newUser = new userModel({
    username: req.body.name,
    password: req.body.password
  });
  console.log(newUser);
  newUser.save(function (err, data) {
    if (err) { return console.log(err) }
    req.session.user = req.body.name;
    req.flash('success', '你已成功注册账号=。=');
    res.redirect('/');
  });
});

router.get('/login', checkNotLogin, function (req, res, next) {
  res.render('login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/login', checkNotLogin, function (req, res, next) {
  var md5 = crypto.createHash('md5');
  var User = {
    username: req.body.name,
    password: req.body.password
  };
  userModel.findOne(User, function (err, docs) {
    if (err) { return console.log(err) }
    if(!docs){
      req.flash('error', '请检查账号或密码！');
      res.redirect('/');
    }else{
      req.session.user = req.body.name;
      req.flash('success', '欢迎回来！');
      res.redirect('/');
    }
  })
  //password = md5.update(req.body.password).digest('hex');
  
});
router.get('/post', checkLogin, function (req, res, next) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/post', checkLogin, function (req, res, next) {
  var newPost = new postModel({
    username:req.session.user,
    title: req.body.title,
    content: req.body.content,
    postid:Math.ceil(Math.random()*100000)
  });
  newPost.save(function (err, data) {
    if (err) { return console.log(err) }
    req.flash('success', '已上传文章=。=');
    res.redirect('/');
  });

});
router.get('/blog/:postid', function (req, res, next) {
  var postContent ={
    postid: req.params.postid
  };
  //过滤参数
  var field={
    _id:0,
    title:1,
    time:1,
    content:1,
    username:1
  }
  postModel.find(postContent, field,{lean:true},function (err, docs) {
    if (err) { return console.log(err) }
    if(!docs){
      req.flash('error', '没有文章哦！');
      res.redirect('/blog');
    }else{
      console.log(docs);
      res.render('acticle',{postContent:docs});
    }
  });
});
router.get('/blog', function (req, res, next) {
  //公用接口
  var post ={
    username: req.session.user
  };
  var postprivate ={
    username: "issazhu"
  };
  //过滤参数
  var field={
    _id:0,
    title:1,
    time:1,
    postid:1,
    username:0
  }
  postModel.find(postprivate, field,{lean:true},function (err, docs) {
    if (err) { return console.log(err) }
    if(!docs){
      req.flash('error', '没有文章哦！快发表吧');
      res.redirect('/post');
    }else{
      res.render('blog',{postslist:docs});
    }
  })
});
router.get('/logout', checkLogin, function (req, res, next) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!');
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!');
    res.redirect('back');//返回之前的页面
  }
  next();
};
module.exports = router;
