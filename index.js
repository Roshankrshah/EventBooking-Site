require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/events');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events=>{
                return events.map(event=>{
                    return {...event._doc,_id: event.id};
                });
            }).catch(err=>{
                throw err;
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save().then(result => {
                return { ...result._doc, _id: result._doc._id.toString() }
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
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

