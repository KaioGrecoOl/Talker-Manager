const fs = require('fs/promises');

const talkerList = async (req, res) => {
  const getTalkers = await fs.readFile('./talker.json', { encoding: 'utf8' });
  const data = JSON.parse(getTalkers);
  return res.status(200).json(data);
};

module.exports = talkerList;
