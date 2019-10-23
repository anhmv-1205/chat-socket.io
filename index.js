var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000, () => {
    console.log("Listening port 3000");
});

var arrUsersOnline = [];

io.on("connection", (socket) => {
    console.log("People connected: " + socket.id);
    socket.on("Client-send-Username", (data) => {
        console.log(data);
        if (arrUsersOnline.indexOf(data) >= 0) {
            socket.emit("server-send-register-fail");
        } else {
            arrUsersOnline.push(data);
            socket.UserName = data;
            socket.emit("server-send-register-success", data);
            io.sockets.emit("server-send-list-user", arrUsersOnline);
        }
    });

    socket.on("logout", () => {
        arrUsersOnline.splice(
            arrUsersOnline.indexOf(socket.UserName), 1
        );
        socket.broadcast.emit("server-send-list-user", arrUsersOnline);
    });

    socket.on("send-message", (data) => {
        io.sockets.emit("server-send-message", {username: socket.UserName, content: data});
    });

    socket.on("client-send-user-is-typing", () => {
        io.sockets.emit("server-send-user-is-typing", socket.UserName);
    });

    socket.on("client-send-user-stopped-type", () => {
        io.sockets.emit("server-send-user-stopped-type");
    });

    socket.on("client-send-create-room", (data) => {
        socket.join(data)
        socket.roomName = data;

        var arrayRoomName = []

        for(room in socket.adapter.rooms) {
            arrayRoomName.push(room);
        }

        console.log("new room: " + arrayRoomName)
        io.sockets.emit("server-send-list-room", arrayRoomName);
        
        socket.emit("server-send-room-socket", data);
    });

    socket.on("client-send-user-chat", (data) => {
        io.sockets.in(socket.roomName).emit("server-send-chat", data);
    });
    // socket.adapter.rooms
});

app.get('/', (req, res) => {
    res.render("home");
});

app.get("/room", (req, res) => {
    res.render("room")
});