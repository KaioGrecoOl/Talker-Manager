const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./helpers/helper');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', helper.talkerList);

app.get('/talker/:id', helper.talkersId);

app.listen(PORT, () => {
  console.log('Online');
});