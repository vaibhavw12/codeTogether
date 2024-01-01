const app = require("express")()
const server = require('http').createServer(app)
const {Server} = require("socket.io")
const dotenv = require('dotenv')
const cors = require('cors')
const ACTIONS = require('./actions/Action.js')
dotenv.config()
app.use(cors());

const io = new Server(server)

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        // console.log(username)
        // console.log(roomId)
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        console.log(roomId)
        console.log(code)
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, code);
    });
    
    // socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    //     io.to(socketId).emit(ACTIONS.CODE_CHANGE, code );
    // });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

server.listen(4000, ()=>{
    console.log('sever is running on PORT 4000 ')
})