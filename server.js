import express from 'express'
import { generate } from './chatbot.js';

const app = express();
const port  = 4001

app.use(express.json())

app.get("/", (req, res)=>{
    res.send("Welcome to chat bot")
})

app.post('/chat', async (req,res)=>{
    const {message} = req.body;
    console.log('message', message)

    const result = await generate(message)

    res.json({message: result})
})

app.listen(port, ()=>{
    console.log(`Server is running port: ${port}`)
})