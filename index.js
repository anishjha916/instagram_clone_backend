const express = require('express');
const port = 3000;
const port1 = 3001;
const app = express();
const bodyParser = require('body-parser');


 
require('./db');
require('./modal/User');
require('./modal/Message');

const authroutes = require('./routes/authRoutes');
const uploadmediaroutes = require('./routes/Uploadmediaroutes')
const messageRoutes = require('./routes/Messagerotes')

// socket io
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();


const io = new Server(httpServer, { /* options */ });

app.use(bodyParser.json())  
app.use(authroutes)
app.use(uploadmediaroutes)
app.use(messageRoutes)



app.get('/',(req,res) => {
    res.send("hello")
})  

//...........18

io.on("connection", (socket) => {

    console.log("USER CONNECTED - ", socket.id);

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED - ", socket.id);
    });   

    socket.on("join_room", (data) => {
        console.log("USER WITH ID - ",socket.id,"JOIN ROOM - ", data.roomid);
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        console.log("MESSAGE RECEIVED - ", data);
        io.emit("receive_message", data);
    });
});


// httpServer.listen(3001);
httpServer.listen(port1, () => {
    console.log("socket server running", port1);
})

app.listen(port, () => {
    console.log("Server is On");
})