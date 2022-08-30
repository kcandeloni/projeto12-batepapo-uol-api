import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const participants = [];
const messages = [];

//participants
app.post('/participants', (req, res)=>{
    
    participants.push({
       id: participants.length + 1,
       lastStatus: Date.now(),
       ...req.body
    });

    //{from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}

    if(false){
        res.status(422);
    }
    if(false){
        res.status(422);
    }
    if(true){
        res.status(201);
    }
});

app.get('/participants', (req, res)=> {
    
    res.send(participants);
});

//messages
app.post('/messages', (req, res)=> {
    
    res.send('messages');
});

app.get('/messages', (req, res)=> {
    
    res.send('messages');
});

//status
app.post('/status', (req, res)=> {
    
    res.send('status');
});

app.get('/status', (req, res)=> {
    
    res.send('status');
});

app.listen(5000);