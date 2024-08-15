import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors'

const port = 3009;

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin:"http://localhost:5173",
    methods:["GET", "POST"],
    credentials:true,
  }
} );
app.use(cors({
  origin:"http://localhost:5173/",
  methods:["GET","POST"],
  credentials:true,
}));

app.get('/',(req,res) => {
  res.send("Hello World");
})

io.on("connection",(socket)=>{
    console.log("user connected",socket.id);
  
    socket.join("some room");
    io.to("some room").emit("some event");
socket.on("message",({room,message}) => {
  console.log({room,message});
      io.to(room).emit("receive-message",message)
    })
    socket.on("disconnect",() => {
      console.log("User DIsconnected", socket.id)
    })
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});