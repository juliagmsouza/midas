import express from 'express';
import EventPublisher from './infra/event-publisher';
import EventPublisher from './infra/event-publisher';


const app = express()
app.use(express.json());
const port = 3000

app.post('/', async (req, res) => {
    const { url } = req.body;
    const eventPublisher = new EventPublisher()
    const response = eventPublisher.sendMessage(url);
    res.send(response);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})