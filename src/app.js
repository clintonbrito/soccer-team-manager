const express = require('express');
const helmet = require('helmet');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');

// require no nosso novo router
const teamsRouter = require('./routes/teamsRouter');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static('./images'));
app.use(express.json());
app.use(cors());

// monta o router na rota /teams
app.use('/teams', teamsRouter);

// middlewares para tratar erros
app.use((err, _req, _res, next) => {
  console.error(err.stack);
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: `Algo deu errado! Mensagem: ${err.message}` });
});

module.exports = app;