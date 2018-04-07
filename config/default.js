module.exports = {
    port: 3888,
    session: {
      secret: 'wtf',
      key: 'blog',
      maxAge: 3*24*60*60*1000 
    },
    mongodb: 'mongodb://localhost:27017/blog'
  }