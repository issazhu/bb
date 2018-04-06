var express = require('express');
var crypto = require('crypto');
var path = require('path');
const UserModel = require(path.resolve('./app_server/models/users.js'));
var User = require(path.resolve('./app_server/models/link.js'));
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Wotfoo' });
});
router.get('/reg', function (req, res, next) {
  res.render('reg', { title: '注册' });
});
router.post('/reg', function (req, res, next) {
  var name = req.body.name;
  var password = req.body.password;

  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
    password = md5.update(req.body.password).digest('hex');
  var newUser= {
    name: name,
    password: password,
  };
    //如果不存在则新增用户
    UserModel.create(newUser)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0];
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/');
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/reg');
      }
      next(e)
    });
  
});
router.get('/login', function (req, res, next) {
  res.render('login', { title: '登录' });
});
router.post('/login', function (req, res, next) {
});
router.get('/post', function (req, res, next) {
  res.render('post', { title: '发表' });
});
router.post('/post', function (req, res, next) {
});
router.get('/logout', function (req, res, next) {
});

module.exports = router;
