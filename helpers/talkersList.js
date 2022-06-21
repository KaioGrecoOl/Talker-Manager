const fs = require('fs/promises');

const talkerList = async (req, res) => {
  const getTalkers = await fs.readFile('./talker.json');
  const data = JSON.parse(getTalkers);
  return res.status(200).json(data);
};

module.exports = talkerList;