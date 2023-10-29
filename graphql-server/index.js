import { ApolloServer, gql } from "apollo-server";

const enquetes = [
  {
    id: "1",
    title: "Cachorro ou gato?",
    description: "Qual é o melhor bichinho de estimação?",
    options: [
      {
        id: "1",
        description: "gato",
        votes: 0,
      },
      {
        id: "2",
        description: "cachorro",
        votes: 0,
      },
    ],
  },
  {
    id: "2",
    title: "Coca-Cola ou Pepsi?",
    description: "Qual é o melhor refrigerante?",
    options: [
      {
        id: "1",
        description: "coca-cola",
        votes: 0,
      },
      {
        id: "2",
        description: "pepsi",
        votes: 0,
      },
    ],
  },
];

const typeDefs = gql`
  type Option {
    id: ID
    description: String
    votes: Int
  }

  type Enquete {
    id: ID
    title: String
    description: String
    options: [Option]
  }

  type Query {
    enquetes: [Enquete]
    options: [Option]
  }

  type Mutation {
    createEnquete(title: String, description: String, options: [String]): Enquete
    deleteEnquete(id: ID): Enquete
    vote(enqueteId: ID, optionId: ID): Enquete    
  }
`;

const resolvers = {
  Query: {
    enquetes: () => enquetes,
  },
  Mutation: {
    createEnquete: (_, { title, description, options }) => {
      const id = String(enquetes.length + 1);
      const newEnquete = {
        id,
        title,
        description,
        options: options.map((option, index) => ({
          id: String(index + 1),
          description: option,
          votes: 0,
        })),
      };
      enquetes.push(newEnquete);
      return newEnquete;
    },
    vote: (_, { enqueteId, optionId }) => {
      for (const enquete of enquetes) {
        if (enquete.id === enqueteId) {
          for (const option of enquete.options) {
            if (option.id === optionId) {
              option.votes += 1;
              return enquetes; // Retorne a lista de enquetes atualizada.
            }
          }
        }
      }
      throw new Error("Enquete ou opção não encontrada.");
    },
    deleteEnquete: (_, { id }) => {
      const index = enquetes.findIndex(enquete => enquete.id === id);
      if (index !== -1) {
        const deletedEnquete = enquetes.splice(index, 1)[0];
        return deletedEnquete;
      } else {
        throw new Error("Enquete não encontrada.");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
