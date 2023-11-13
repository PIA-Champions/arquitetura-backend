const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { GraphQLClient } = require('graphql-request');

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
          id
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

  socket.on('opcoes enquete', async (idEnquete) => {
    try {
      const mutation = `
        mutation ListaEspecifico($listaEspecificoId: String) {
          listaEspecifico(id: $listaEspecificoId) {
            title
            options {
              votes
              id
              description
            }
            description
            id
          }
        }
      `;
  
      const variables = { listaEspecificoId: idEnquete };
  
      const data = await client.request(mutation, variables);
  
      // Adiciona o id da enquete ao objeto de opções
      const opcoesEnquete = {
        enqueteId: data.listaEspecifico.id,
        options: data.listaEspecifico.options,
      };
  
      io.emit('opcoes enquete', opcoesEnquete);
    } catch (error) {
      console.error('Erro ao buscar as opções da enquete:', error);
      io.emit('opcoes enquete', []);
    }
  });
  
  
  socket.on('votar', async (enqueteId, opcaoId) => {
    try {
      // Mutation para adicionar o voto
      const mutation = `
        mutation AddVote($addVoteId: String, $option: String) {
          addVote(id: $addVoteId, option: $option) {
            description
            votes
            id
          }
        }
      `;
  
      const variables = { addVoteId: enqueteId.toString(), option: opcaoId.toString() };
  
      const data = await client.request(mutation, variables);
  
      console.log('Voto registrado com sucesso:', data.addVote);
  
    } catch (error) {
      console.error('Erro ao votar:', error);
    }
  });
  
  

});

server.listen(3000, () => {
  console.log('Ouvindo na porta 3000');
});
