const express = require('express');
require('express-async-errors');

const app = express();

const teams = require('./utils/teams');
const apiCredentials = require('./middlewares/apiCredentials');
const validateTeam = require('./middlewares/validateTeam');
const existingId = require('./middlewares/existingId');

app.use(express.json());
app.use(apiCredentials);

let nextId = 3;

app.get('/teams', (req, res) => res.json(teams));

app.get('/teams/:id', (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find((t) => t.id === id);

  if (team) {
    res.json(team);
  } else {
    res.sendStatus(404);
  }
});

// Arranja os middlewares para chamar validateTeam primeiro
// app.post('/teams', validateTeam, (req, res) => {
//   const team = { id: nextId, ...req.body };
//   teams.push(team);
//   nextId += 1;
//   res.status(201).json(team);
// });

app.post('/teams', validateTeam, (req, res) => {
  if (
    // confere se a sigla proposta está inclusa nos times autorizados
    !req.teams.teams.includes(req.body.sigla)
    // confere se já não existe um time com essa sigla
    && teams.every((t) => t.sigla !== req.body.sigla)
  ) {
    return res.status(422).json({ message: 'Já existe um time com essa sigla' });
  }

  const team = { id: nextId, ...req.body };
  teams.push(team);
  nextId += 1;
  res.status(201).json(team);
});

app.put('/teams/:id', existingId, validateTeam, (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find((t) => t.id === id);

  // Não é mais necessário conferir se team existe por conta da validação prévia efetuada pelo middleware
  const index = teams.indexOf(team);
  const updated = { id, ...req.body };
  teams.splice(index, 1, updated);
  res.status(201).json(updated);
});

app.delete('/teams/:id', existingId, (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find((t) => t.id === id);

  const index = teams.indexOf(team);
  teams.splice(index, 1);
  res.sendStatus(204);
});

module.exports = app;