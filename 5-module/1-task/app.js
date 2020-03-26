const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

var subscribles = [];

router.get('/subscribe', async (ctx, next) => {   
  const promise = new Promise((resolve, reject) => {    
    subscribles.push(resolve);
  });
  let message;
  try {
    message = await promise;
  } catch (err) {
    if (err.code === "ECONNRESET") return;
    throw err;
  }
  ctx.body = message;    
});

router.post('/publish', async (ctx, next) => {  
  const message = ctx.request.body.message
  if (!message) {
    ctx.throw(400);
  }
  subscribles.forEach(function (resolve) {
    resolve(String(message));
  });
  subscribles = [];
  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;
