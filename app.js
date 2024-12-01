const express = require('express');
const path = require('path');
const chat_data = require('./src/data.json');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'views')));
app.use('/styles',express.static(path.join(__dirname,'styles')));

app.get('/', (req, res)=>{
    res.render('menu');
});

app.get('/chat/:id', (req, res)=>{
    const {id} = req.params;
    const required_chat = chat_data.chats.find(chat => chat.chat_id === id );
    res.render(`chat`, {
        chat_data : required_chat.chat_messages,
        chat_id : id
    });
});

app.post('/chat/:id', (req, res)=>{
    const {id} = req.params;
    const new_data = req.body;
    const required_chat = chat_data.chats.find(chat => chat.chat_id === id );
    required_chat.chat_messages.push(new_data);
    res.redirect(`/chat/${id}`);
});

app.listen(PORT, ()=>{
    console.log('listening on PORT 3000...')
});