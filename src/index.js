import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db('test');
});

const app = express();

app.use(express.json());
app.use(cors());

const participantsSchema = joi.object({
    name: joi.string().required(),
});

const messagesSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.string().required().valid('message', 'private_message')
});

const messages = [];

//participants
app.post('/participants', async (req, res)=>{
    const { name } = {...req.body}
    const lastStatus = Date.now();
    const validation = participantsSchema.validate(req.body, { abortEarly: true });

    if (validation.error) {
        console.log(validation.error.details.map(err => err.messages))
        res.sendStatus(422);
        return;
    }

    try {
        const uniqueParticipants = await db.collection('participants').findOne({
        name: name
        });

        if(!!uniqueParticipants){
            res.sendStatus(409);
            return;
        }

        await db.collection('participants').insertOne({
            lastStatus,
            name
        });
        await db.collection('messages').insertOne({
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs(lastStatus).format('HH:mm:ss')
        });
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    
});

app.get('/participants', async (req, res) => {
    try {
      const participants = await db.collection('participants').find().toArray();
      res.send(participants);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
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