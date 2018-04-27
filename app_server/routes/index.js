var express = require('express');
var crypto = require('crypto');
var userModel = require("../models/userModel.js");
var postModel = require("../models/postModel.js");
var checkLoginfun= require("../controllers/checkLogin.js");
var checkLogin=checkLoginfun.checkLogin;
var checkNotLogin=checkLoginfun.checkNotLogin;
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
//注册页面
router.get('/reg', checkNotLogin, function (req, res, next) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
//注册功能
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
//登录
router.get('/login', checkNotLogin, function (req, res, next) {
  res.render('login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
//登录功能
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

router.get('/logout', checkLogin, function (req, res, next) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

module.exports = router;
