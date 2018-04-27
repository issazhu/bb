var express = require('express');
var userModel = require("../models/userModel.js");
var postModel = require("../models/postModel.js");
var checkLoginfun= require("../controllers/checkLogin.js");
var checkLogin=checkLoginfun.checkLogin;
var checkNotLogin=checkLoginfun.checkNotLogin;
var router = express.Router();

router.get('/:username', function (req, res, next) {
  //公用接口
  var userPost ={
    username: req.params.username
  };
  //过滤参数
  var field={
    _id:0,
    title:1,
    time:1,
    postid:1,
    username:1
  }
  postModel.find(userPost, field,{lean:true},function (err, docs) {
    if (err) { return console.log(err) }
    if(!docs){
      req.flash('error', '没有文章哦！快发表吧');
      res.redirect('/');
    }else{
      res.render('blog',{postslist:docs});
    }
  })
});
router.get('/', function (req, res, next) {
  //过滤参数
  var field={
    _id:0,
    title:1,
    time:1,
    postid:1,
    username:1
  }
  postModel.find({}, field,{lean:true},function (err, docs) {
    if (err) { return console.log(err) }
    if(!docs){
      req.flash('error', '没有文章哦！快发表吧');
      res.redirect('/');
    }else{
      res.render('blog',{postslist:docs});
    }
  })
});
module.exports = router;
