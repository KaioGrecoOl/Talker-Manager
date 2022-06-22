const fs = require('fs/promises');
const crypto = require('crypto');

const talkerList = async (req, res) => {
  const getTalkers = await fs.readFile('./talker.json');
  const data = JSON.parse(getTalkers);
  return res.status(200).json(data);
};

const talkersId = async (req, res) => {
  const { id } = req.params;
  const talker = await fs.readFile('./talker.json');
  const data = JSON.parse(talker);
  const talkerId = data.find((dataId) => dataId.id === Number(id));
  if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talkerId);
};

// consegui desenvolver a função abaixo apos leitura do conteúdo https://stackoverflow.com/questions/55104802/nodejs-crypto-randombytes-to-string-hex-doubling-size
const tokenGenerator = async (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
};

const emailRequired = { message: 'O campo "email" é obrigatório' };
const emailFormat = { message: 'O "email" deve ter o formato "email@email.com"' };
const passwordRequired = { message: 'O campo "password" é obrigatório' };
const passwordLength = { message: 'O "password" deve ter pelo menos 6 caracteres' };

const validEmail = (req, res, next) => {
  const { email } = req.body;
  const acceptEmail = /\S+@\S+\.\S+/;
  if (!email) {
    return res.status(400).json(emailRequired);
  }
  if (!acceptEmail.test(email)) {
    return res.status(400).json(emailFormat);
  }
  next();
};

const validPassword = (req, res, next) => {
  const { password } = req.body;
  const magicNumber = 6;
  if (!password) {
    res.status(400).json(passwordRequired);
  }
  if (password.length < magicNumber) {
    res.status(400).json(passwordLength);
  }
  next();
};

const validToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateInfoTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  next();
};

// consegui desenvolver a função apos ler o conteúdo https://stackoverflow.com/questions/5465375/javascript-date-regex-dd-mm-yyyy
const validateDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const validDate = /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/;
  if (!watchedAt.match(validDate)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

const newTalkerInfo = async (req, res) => {
  const { name, age, talk } = req.body;
  const getTalker = JSON.parse(await fs.readFile('./talker.json'));
  const talkerInfo = { id: getTalker.length + 1, name, age, talk };
  getTalker.push(talkerInfo);
  await fs.writeFile('./talker.json', JSON.stringify(getTalker));
  return res.status(201).json(talkerInfo);
};

module.exports = { talkerList,
  talkersId, 
  tokenGenerator, 
  validEmail, 
  validPassword, 
  validToken, 
  validateName,
  validateAge,
  validateInfoTalk,
  validateDate,
  validateRate,
  newTalkerInfo };
