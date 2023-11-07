# Nodejs com GRAPHQL.

Comandos prompt-dos do windows 10 e metodologias utilizadas de forma resumida:

Criar pasta do projeto: graphql-server

Entrar na pasta do projeto: graphql-server

npm init -y

npm init --yes && npm pkg set type="module"

npm install @apollo/server graphql

npm install

npm update

node index.js

node src/index.js

No browser: http://localhost:4000
-------------------------------------------------------------------------------------------------
Link para visualizar as Enquetes e suas oções de votos:

https://ix6iixqdf3.execute-api.us-east-1.amazonaws.com/prd/survey

Observação: Cada alteração execute o link anterior.

-------------------------------------------------------------------------------------------------
Comandos formato GRAPHQL:

-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------
1) Exemplos de Consultas:

query { 
  enquetes {
    id
    description
    title
    options {
      id
      description
      votes
    }
  }
}  
-------------------------------------------------------------------------------------------------
query { 
  enquetes {
    description
    }
  }
}  
-------------------------------------------------------------------------------------------------
query { 
  enquetes {
    id
    title
    description
    }
  }
}  
-------------------------------------------------------------------------------------------------
query { 
  enquetes {
    id
    description
    title
  }
}  


-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------
2) Criar enquetes novas:

2.1) Criação de enquete Exemplo1:

mutation {
  addEnquete(
    title: "Qual é a sua cor favorita?",
    description: "Escolha sua cor favorita entre as opções.",
    options: [
      { description: "Vermelho", votes: 0 },
      { description: "Azul", votes: 0 },
      { description: "Verde", votes: 0 }
    ]
  ) {
    title
    description
    options {
      description
      votes
    }
  }
}

-----------------------------------------------------------------------------------------------------------
Comando de consulta para verificar se a Enquete foi criada:

query { 
  enquetes {
    id
    description
    }
  }
}  

-------------------------------------------------------------------------------------------------
2.2) Criação de enquete Exemplo2:

mutation {
  addEnquete(
    title: "Qual refrigerante é o melhor?",
    description: "Ambos são os refrigerantes que disputam a preferência dos brasileiros.",
    options: [
      { description: "coca-cola", votes: 0 },
      { description: "pepsi", votes: 0 },
      { description: "guarana", votes: 0 }
    ]
  ) {
    title
    description
    options {
      description
      votes
    }
  }
}
-------------------------------------------------------------------------------------------------
Comando de consulta para verificar se a Enquete foi criada:

query { 
  enquetes {
    id
    description
    }
  }
}  


-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------
3) Voto nas Enquetes:

3.1) Voto na Enquete exemplo 1:

mutation addEnqueteVote {
  addVote(id: "21878482-729f-11ee-8ecb-f70fa366a824", option: "21878481-729f-11ee-8ecb-f70fa366a824") {
    description
    votes
    id
  }
}
-------------------------------------------------------------------------------------------------
Comando de consulta para verificar voto em uma das opçõe da Enquete:

query { 
  enquetes {
    id
    description
    }
  }
}  


-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------
4) Deletar uma Enquete específica:

4.1) Deletar uma Enquete específica - Exemplo 1:

mutation {
  deletaEnquete(id: "9ebea2f2-7d0b-11ee-833a-7506b293e538") {
    id
    title
    description
  }
}

-------------------------------------------------------------------------------------------------
Comando de consulta para verificar se a Enquete foi apagada e as Enquentes ainda existentes - Exemplo 1:

query { 
  enquetes {
    id
    description
    }
  }
}  
-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------

