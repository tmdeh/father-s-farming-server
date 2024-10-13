const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connect = require('./database/server');
const dotenv = require('dotenv');
dotenv.config();

const markets = require('./routes/markets');
const products = require('./routes/product');

const product = require('./modules/cron/product');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 라우터 설정
app.use('/markets', markets);
app.use('/products', products);

// 데이터베이스 연결
connect();

// 스케줄러
product.scheduleUpdate();

// 404 처리 미들웨어
app.use(function(req, res, next) {
  next(createError(404));
});

// 전역 에러 처리 미들웨어
app.use(function(err, req, res, next) {
  
  console.log(err)

  const statusCode = err.status || 500;

  // 개발 환경에서만 에러 스택 표시
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 에러 로깅
  console.error(err.stack);

  // 클라이언트에 에러 응답 전송
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
