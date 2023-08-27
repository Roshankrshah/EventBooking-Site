require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/ind');
const graphQlResolvers = require('./graphql/resolvers/ind');
const isAuth = require('./middleware/is-auth')

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(3003, () => {
            console.log(`Server listening at http://localhost:3003`);
        });
    })
    .catch(err => {
        console.log(err);
    });

