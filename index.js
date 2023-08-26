const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Building GraphQL server');
})

app.listen(3003,()=>{
    console.log(`Server listening at http://localhost:3003`);
});