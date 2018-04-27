var express = require('express');
var postModel = require("../models/postModel.js");
var checkLoginfun= require("../controllers/checkLogin.js");
var checkLogin=checkLoginfun.checkLogin;
var checkNotLogin=checkLoginfun.checkNotLogin;
var router = express.Router();

//发表文章页面
router.get('/', checkLogin, function (req, res, next) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
//发表功能
//有坑，若postid重覆会发布出错
router.post('/', checkLogin, function (req, res, next) {
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
//按文章编号取文章
router.get('/:postid', function (req, res, next) {
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
      res.redirect('/');
    }else{
      console.log(docs);
      res.render('acticle',{postContent:docs});
    }
  });
});

module.exports = router;
