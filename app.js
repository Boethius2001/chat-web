const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const chats = require('./src/chats.js');
const {rand_id} = require('./src/idgen.js');

const app = express();
const PORT = 3000;
const ID_size = 10;

const db_name = "chatdb";
const URI = `mongodb://localhost/${db_name}`;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'views')));
app.use('/styles',express.static(path.join(__dirname,'styles')));

mongoose.connect(URI);

async function create_chat(Chat_ID, chat_messages){
    const chat = chats.create({
        chat_id : Chat_ID,
        chat_messages : chat_messages //change this
    });
    console.log("chat created");
}

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

// Double host bug FIX IT!!!
app.post('/chat/:username', (req, res)=>{
    const {username} = req.params;
    let {chatid} = req.body;
    if(chatid.length === 0){
        chatid = rand_id(ID_size);
        create_chat(chatid, []);
    }
    chats.findOne({chat_id : {$ne:chatid}}).then(chat=>{
        //create_chat(chatid, []);
        res.redirect(`/chat/${username}/${chatid}`);
    }).catch((err)=>{
        console.error(err);
    });

    //res.redirect(`/chat/${username}/${chatid}`);

})

app.get('/chat/:username/:id', (req, res)=>{
    const {id, username} = req.params;

    chats.findOne({ chat_id : id }).then(chat =>{
        console.log(chat.chat_messages);
        res.render(`chat`,{
            chat_data : chat.chat_messages,
            chat_id : id,
            username : username
        })
    }).catch((err)=>{
        console.error(err);
    });
});

app.post('/chat/:username/:id', (req, res)=>{
    const {id, username} = req.params;
    const new_data = req.body;
    req.body.username = username;

    chats.updateOne({chat_id : id}, {$push:{chat_messages : new_data}}).then(chat =>{
        console.log(chat);
    }).catch((err)=>{
        console.error(err);
    })
    res.redirect(`/chat/${username}/${id}`);
});

app.get('/*', (req, res)=>{
    res.send('Nothing found here');
});

app.listen(PORT, ()=>{
    console.log(`listening on PORT http://localhost:${PORT}/`);
});