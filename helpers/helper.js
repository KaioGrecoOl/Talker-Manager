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
const login = async (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
};

module.exports = { talkerList, talkersId, login };