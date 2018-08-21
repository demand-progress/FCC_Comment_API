const postComment = require('../commentFunc.js');

const appRouter = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to our restful API');
  });
  app.post('/comment', (req, res) => postComment(req.body).then(answer => res.send(answer)));
};
module.exports = appRouter;
