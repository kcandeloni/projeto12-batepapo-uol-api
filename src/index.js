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
  db = mongoClient.db('chat_uol_api');
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

//participants
app.post('/participants', async (req, res)=>{
    const { name } = {...req.body}
    const lastStatus = Date.now();
    const validation = participantsSchema.validate(req.body, { abortEarly: true });

    if (validation.error) {
        console.log(validation.error.details.map(err => err.message))
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
app.post('/messages', async (req, res)=>{
    const { to, text, type } = {...req.body}
    const { user } = req.headers;
    const lastStatus = Date.now();
    const validation = messagesSchema.validate(req.body, { abortEarly: true });

    if (validation.error) {
        console.log(validation.error.details.map(err => err.message))
        res.sendStatus(422);
        return;
    }
    
    try {
        const validUser = await db.collection('participants').findOne({
        name: user
        });

        if(!validUser){
            res.sendStatus(422);
            return;
        }

        await db.collection('messages').insertOne({
            from: user,
            to,
            text,
            type,
            time: dayjs(lastStatus).format('HH:mm:ss')
        });
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    
});

function filterMessages(user, messages, limit=0){
    const userMessages = messages.filter(
        message => {
            if(message.type === "private_message" && 
                message.from !== user &&
                message.to !== user
            ){
                return false;
            }
            return true;
    });

    if(limit === 0){
        return userMessages;
    }
    return userMessages.slice(-(limit))
}

app.get('/messages', async (req, res)=> {
    const { user } = req.headers;
    const { limit } = req.query;
    if (limit && limit < 0) {
        limit = 0;
    }

    try {
        const validUser = await db.collection('participants').findOne({
        name: user
        });

        if(!validUser){
            res.sendStatus(422);
            return;
        }
        const messages = await db.collection('messages').find().toArray();
        const UserMessages = filterMessages(user, messages, limit);
        res.send(UserMessages);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
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