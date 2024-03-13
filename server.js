// Importando as dependências
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

// Inicializando o Express
const app = express();
const server = http.createServer(app);

// Inicializando o Socket.IO
const io = new Server(server);

// Definindo o diretório público
app.use(express.static('public'));

// Função para buscar os dados da API
async function fetchDataAndEmit(socket) {
  try {
    // Consulta à API Sou Cannabis
    const response = await axios.get('https://database.soucannabis.ong.br/items/Users?sort=-date_created&filter=[responsable_type][_neq]=patient&access_token=YeNqgljghf84ZD_5FiAPWvfBOGXZca5t');

    // Emitindo os dados para todos os clientes conectados
    io.emit('data', response.data);
  } catch (error) {
    console.error('Erro ao obter dados da API:', error.message);
  }
}

// Escutando a conexão do Socket.IO
io.on('connection', (socket) => {
  console.log('Um cliente se conectou');

  // Quando um cliente solicita os dados da API
  socket.on('getData', () => {
    // Chamando a função para buscar os dados da API imediatamente quando um cliente se conecta
    fetchDataAndEmit(socket);
  });

  // Lidando com a desconexão do cliente
  socket.on('disconnect', () => {
    console.log('Um cliente se desconectou');
  });
});

// Atualizar os dados da API a cada x segundos
const interval = 60000; // 5000 milissegundos = 5 segundos
setInterval(() => {
  fetchDataAndEmit();
}, interval);

// Rota principal
app.get('/', (req, res) => {
  // Enviando dados para a página index.html
  res.sendFile(__dirname + '/public/index.html');
});

// Inicializando o servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
