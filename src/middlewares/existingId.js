const teams = require('../utils/teams');

// const existingId = (req, res, next) => {
//   const id = Number(req.params.id);

//   if (teams.some((t) => t.id === id)) {
//     next();
//   } else {
//     res.sendStatus(404);
//   }
// };

// função refatorada para personalizar mensagem de erro
const existingId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!teams.some((t) => t.id === id)) {
    return res.status(404).json({ message: 'Time não encontrado' });
  }
  next();
};

module.exports = existingId;