const fs = require('fs/promises');

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

module.exports = { talkerList, talkersId };