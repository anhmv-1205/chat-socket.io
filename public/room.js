var socket = io("http://localhost:3000");

socket.on("server-send-list-room", (data) => {
    $("#list-room").html("");
    data.forEach((element) => {
        $("#list-room").append("<h4 class='room'> Room: " + element + "</h4>")
    });
});

socket.on("server-send-room-socket", (data)=> {
    $("#currentRoom").html(data);
});

socket.on("server-send-chat", (data)=> {
    $("#right-room").append("<div>" + data + "</div>");
});

$(document).ready(() => {
    $("#btnCreateRoom").click(() => {
        socket.emit("client-send-create-room", $("#txtRoom").val());
    });

    $("#btnChat").click(() => {
        socket.emit("client-send-user-chat", $("#txtMessage").val());
    });
});