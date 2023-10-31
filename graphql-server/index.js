import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import { response } from "express";
import fetch from 'node-fetch';

const enquetes = [
  {
    "options": [
      {
        "description": "gato",
        "votes": 0,
        "id": "21878480-729f-11ee-8ecb-f70fa366a824"
      },
      {
        "description": "cachorro",
        "votes": 0,
        "id": "21878481-729f-11ee-8ecb-f70fa366a824"
      }
    ],
    "description": "Qual é o melhor bichinho de estimação?",
    "id": "21878482-729f-11ee-8ecb-f70fa366a824",
    "title": "Cachorro ou gato?"
  },
];

const typeDefs = `#graphql
  
  type Enquete {
    title: String
    id: String
    description: String
    options: [Option]
  }

  type Option {
    description: String
    votes: Int
    id: String
  }
  
  type Query {
    enquetes: [Enquete]
    options: [Option]
  }

  input Option2 {
    description: String
    votes: Int
    id: String
  }

  type Message {
    description: String
    id: String
    votes: Int
  }

  type Mutation {
    addEnquete(title: String, id: String, description: String, options: [Option2]): Enquete
    addVote(id: String, idItem: String): Message
    listaEspecifico(id: String): Enquete
    deletarEnquete(id: ID): Enquete
  }

`;

const resolvers = {
  Query: {
    enquetes: () => enquetes,
    enquetes: () => findAllEnquetes(),
  },

  // adicione dentro do resolvers
  Mutation: {
    addEnquete: (_, { title, id, description, options }) => {
      const enquete = {title, id, description, options }
      return createEnquete(enquete)
    },
    deletarEnquete: (_, { id }) => {
      const index = enquetes.findIndex(enquete => enquete.id === id);
      if (index !== -1) {
        //const deletedEnquete = enquetes.splice(index, 1)[0];
        // return deleteEnquete(enquetes);
        return deleteEnquete(id);
      } else {
        throw new Error("Enquete não encontrada.");
      }
    },
    addVote: (_, { id, idItem }) => addEnqueteVote(id,idItem),
    listaEspecifico: (_, { id }) => findEspecificEnquetes(id)  
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

function findAllEnquetes() {
	return fetch('https://ix6iixqdf3.execute-api.us-east-1.amazonaws.com/prd/survey', {
		method: 'GET',
		headers: { 'Content-Type' : 'application/json' }
	}).then((response) => response.json())
}

function findEspecificEnquetes(id) {
	return fetch(`https://ix6iixqdf3.execute-api.us-east-1.amazonaws.com/prd/survey/${id}`, {
		method: 'GET',
		headers: { 'Content-Type' : 'application/json' }
	}).then((response) => response.json())
}

function createEnquete(enquete){
  return fetch('https://ix6iixqdf3.execute-api.us-east-1.amazonaws.com/prd/survey', {
    method: 'POST',
    body: JSON.stringify(enquete),
    headers: { 'Content-Type' : 'application/json' }
  }).then((response) => response.json())
}

function addEnqueteVote(id,idItem) {
	  return fetch(`https://ix6iixqdf3.execute-api.us-east-1.amazonaws.com/prd/survey/${id}/option/${idItem}/"/r/n`, {
	  method: 'PUT',
    headers: { 'Content-Type' : 'application/json' }
  }).then((response) => response.json())
}

function deleteEnquete(id){
  return fetch(`https://ix6iixqdf3.execute-api.us-east-1.amazonaws.com/prd/survey/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type' : 'application/json' }
  }).then((response) => response.json())
}

console.log(`🚀  Server ready at: ${url}`);
