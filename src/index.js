import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();

app.use(express.json());
app.use(cors());

const participants = [];
const messages = [];

//participants
app.post('/participants', (req, res)=>{
    const { name } = {...req.body}

    const lastStatus = Date.now();
    participants.push({
       id: participants.length + 1,
       lastStatus,
       name
    });

    //db.message.insert()
    messages.push({from: name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs(lastStatus).format('HH:mm:ss')})
    
    if(false){
        res.sendStatus(422);
    }
    if(false){
        res.sendStatus(422);
    }
    if(true){
        res.sendStatus(201);
    }
});

app.get('/participants', (req, res)=> {
    
    res.send(participants);
});

//messages
app.post('/messages', (req, res)=> {
    const { to, text, type } = {...req.body}
    const timeMessage = Date.now();
    const { user } = req.headers;
    messages.push({
       id: messages.length + 1,
       user,
       time: dayjs(timeMessage).format('HH:mm:ss'),
       to,
       text,
       type
    });

    if(false){
        res.sendStatus(422);
    }
    if(false){
        res.sendStatus(422);
    }
    if(true){
        res.sendStatus(201);
    }

});

app.get('/messages', (req, res)=> {
    
    res.send(messages);
});

//status
app.post('/status', (req, res)=> {
    //set lastStatus
    const { user } = req.headers;
    //verifica
    participants.map( user =>
        {if(Date.now() - user.lastStatus > 10000){
            //remove from db
            messages.push({from: user.name, to: 'Todos', text: 'sai da sala...', type: 'status', time: dayjs(Date.now()).format('HH:mm:ss')});
        }}
    )
    console.log(messages);

    res.send('OK');
});

app.listen(5000);