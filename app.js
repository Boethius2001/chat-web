const express = require('express');
const path = require('path');
const chat_data = require('./src/data.json');
const {rand_id} = require('./src/idgen.js');
const {data_temp} = require('./src/temp.js');

const app = express();
const PORT = 3000;
const ID_size = 6;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'views')));
app.use('/styles',express.static(path.join(__dirname,'styles')));

app.get('/', (req, res)=>{
    res.render('menu');
});

app.post('/', (req, res)=>{
    const {username} = req.body;
    res.redirect(`/chat/${username}`);
})

app.get('/chat/:username', (req, res)=>{
    const {username} = req.params;
    res.render('login', { username : username});
})

app.post('/chat/:username', (req, res)=>{
    const {username} = req.params;
    let {chatid} = req.body;
    if(chatid.length === 0){
        chatid = rand_id(ID_size);
    }
    chat_data.chats.push(data_temp(chatid));
    res.redirect(`/chat/${username}/${chatid}`);
})

app.get('/chat/:username/:id', (req, res)=>{
    const {id, username} = req.params;
    const required_chat = chat_data.chats.find(chat => chat.chat_id === id );
    res.render(`chat`, {
        chat_data : required_chat.chat_messages,
        chat_id : id,
        username : username
    });
});

app.post('/chat/:username/:id', (req, res)=>{
    const {id, username} = req.params;
    const new_data = req.body;
    const required_chat = chat_data.chats.find(chat => chat.chat_id === id );
    req.body.username = username;
    required_chat.chat_messages.push(new_data);

    res.redirect(`/chat/${username}/${id}`);
});

app.get('/*', (req, res)=>{
    res.send('Nothing found here');
});

app.listen(PORT, ()=>{
    console.log(`listening on PORT http://localhost:${PORT}/`);
});