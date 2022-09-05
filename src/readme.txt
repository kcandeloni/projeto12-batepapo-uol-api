Para rodar o projeto de API em conjunto com o chat clone do bate-papo do uol:
    Start o mongodb:
        mongod --dbpath ~/.mongo
    Em outro terminal inicie o mongo:
        mongo
    Start API, na raiz do projeto:
        npx nodemon ./src/index
Enderoço base para querisições no axios no front-end:
    http://localhost:5000/