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

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');

    if(req.method=== 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

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

