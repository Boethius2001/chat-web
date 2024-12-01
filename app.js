const express = require('express');
const path = require('path');
const chat_data = require('./src/data.json');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'views')));

app.get('/', (req, res)=>{
    res.render('menu');
});

app.get('/chat', (req, res)=>{
    res.render(`chat`, {chat_data});
});

app.post('/chat', (req, res)=>{
    const new_data = req.body;
    chat_data.push(new_data);
    res.redirect('/chat');
});

app.listen(PORT, ()=>{
    console.log('listening on PORT 3000...')
});