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

module.exports = { talkerList, talkersId, tokenGenerator, validEmail, validPassword };