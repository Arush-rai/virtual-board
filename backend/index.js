const express = require('express');
const cors = require('cors');
const path = require('path');
const studentRouter = require('./routers/studentRouter');
const teacherRouter = require('./routers/teacherRouter');
const classRouter = require('./routers/classRouter');
const lectureRouter = require('./routers/lectureRouter');
const recordingRouter = require('./routers/recordingRouter');

const app = express();
const port = 5000;

app.use(cors({
    origin: ['http://localhost:3000','https://virtual-board-nine.vercel.app'],
    credentials: true
}));
app.use(express.json());

app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);
app.use('/classroom', classRouter);
app.use('/lectures', lectureRouter);
app.use('/recordings', recordingRouter);

// Add this line to your server file to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    console.log('response from express');
    res.send('Hello from Express!');
});

app.listen(port, () => {
    console.log('server started');
});
