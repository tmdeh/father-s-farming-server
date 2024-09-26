const mongoose = require('mongoose');

const connect = () => {
  // 만일 배포용이 아니라면, 디버깅 on
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true); // 몽고 쿼리가 콘솔에서 뜨게 한다.
  }
  mongoose.connect(`mongodb://${process.env.DB}:27017/farming`);
};


module.exports = connect;
