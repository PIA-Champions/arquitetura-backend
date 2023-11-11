const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { GraphQLClient } = require('graphql-request');
const { log } = require('console');

// URL do seu endpoint GraphQL
const endpoint = 'https://bgsjdeelyk.execute-api.us-east-1.amazonaws.com';
const client = new GraphQLClient(endpoint);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Lógica do Socket.IO
io.on('connection', (socket) => {
  socket.on('buscar enquetes', async () => {
    try {
      const query = `{
        enquetes {
          title
          description
          options {
            description
            votes
          }
        }
      }`;

      const data = await client.request(query);
      console.log('Enquetes recuperadas:', data);

      // Enviar as enquetes recuperadas para o cliente
      socket.emit('enquetes recuperadas', data.enquetes);
    } catch (error) {
      console.error('Erro ao buscar as enquetes:', error);
    }
  });

  socket.on('criar enquete', async (pergunta, opcoes) => {
    try {
      const mutation = `mutation {
        addEnquete(
          title: "${pergunta}",
          description: "Descrição da enquete aqui...",
          options: [
            ${opcoes.map(option => `{ description: "${option}", votes: 0 }`).join(',')}
          ]
        ) {
          title
          description
          options {
            description
            votes
          }
        }
      }`;

      const data = await client.request(mutation);
      console.log('Nova enquete criada:', data);

      // Enviar mensagem para todos os clientes sobre a nova enquete
      io.emit('enquetes atualizadas', data);
    } catch (error) {
      console.error('Erro ao criar a enquete:', error);
    }
  });

  socket.on('deletar enquete', async (enqueteId) => {
    try {
      const mutation = `mutation {
        deleteEnquete(
          id: "${enqueteId}"
        ) {
          success
          message
        }
      }`;

      const data = await client.request(mutation);
      console.log('Enquete deletada:', data);

      io.emit('enquete deletada', enqueteId);
    } catch (error) {
      console.error('Erro ao deletar a enquete:', error);
    }
  });

  socket.on('opcoes enquete', async (index) => {
    try {
      const query = `query {
        enquetes {
          options {
            description
            votes
          }
        }
      }`;

      const data = await client.request(query);
      if (data.enquetes && data.enquetes[index] && data.enquetes[index].options) {
        const opcoesDaEnquete = data.enquetes[index].options;
        io.emit('opcoes enquete', opcoesDaEnquete);
      } else {
        io.emit('opcoes enquete', []);
      }
    } catch (error) {
      console.error('Erro ao buscar as opções da enquete:', error);
      io.emit('opcoes enquete', []);
    }
  });

  socket.on('votar', async (opcaoSelecionada) => {
    try {
      const query = `query {
        enquetes {
          title
          description
          options {
            description
            votes
          }
        }
      }`;
      const data = await client.request(query);
      const enqueteEncontrada = data.enquetes.find(enquete => enquete.description === opcaoSelecionada);
      console.log("aqui" + data)
      if (enqueteEncontrada) {
        const opcaoVotada = enqueteEncontrada.opcoes.find(opcao => opcao.description === opcaoSelecionada);

        if (opcaoVotada) {
          // Incrementar o contador de votos para a opção escolhida
          opcaoVotada.votes++;
          // Emitir a informação atualizada de enquete para todos os clientes
          io.emit('enquetes atualizadas', enquetes);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar as opções da enquete:', error);
      io.emit('opcoes enquete', []);
    }
  });

});

server.listen(3000, () => {
  console.log('Ouvindo na porta 3000');
});
