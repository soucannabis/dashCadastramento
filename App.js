const React = require('react');
const { useEffect, useState } = require('react');
const io = require('socket.io-client');

const socket = io();

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Solicitar os dados da API ao servidor via WebSocket
    socket.emit('getData');

    // Ouvir os dados recebidos do servidor
    socket.on('data', (data) => {
      setData(data);
    });

    // Lidar com a desmontagem do componente
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Dados da API</h1>
      {data ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

module.exports = App;
