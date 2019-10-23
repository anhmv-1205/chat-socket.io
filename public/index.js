var socket = io("http://localhost:3000");

socket.on("server-send-register-fail", () => {
    alert("Da co nguoi dang ki");
});

socket.on("server-send-list-user", (data) => {
    console.log(data);
    console.log("here");
    $('#boxContent').html("");
    data.forEach((i) => {
        console.log(i);
        $('#boxContent').append("<div class='user'>" + i + "</div>");
    });
});

socket.on("server-send-register-success", (data) => {
    $("#currentUser").html(data);
    $("#loginForm").hide(2000);
    $("#chatForm").show(1000);
});

socket.on("server-send-message", (data) => {
    $("#listMessages").append("<div class='message'>" + data.username + " : " + data.content + "</div>")
});

socket.on("server-send-user-is-typing", (data) => {
    $("#textShowUserTyping").html("");
    $("#textShowUserTyping").html(data + " is typing");
});

socket.on("server-send-user-stopped-type", () => {
    $("#textShowUserTyping").html("");
   // $("#textShowUserTyping").html(data);
});

$(document).ready(() => {
    $("#loginForm").show();
    $("#chatForm").hide();

    $("#btnRegister").click(() => {
        socket.emit("Client-send-Username", $("#txtUserName").val());
    });

    $("#btnLogout").click(() => {
        console.log("logout");
        socket.emit("logout");
        $("#loginForm").show(2000);
        $("#chatForm").hide(1000);
    });

    $("#btnSendMessage").click(() => {
        socket.emit("send-message", $("#txtMessage").val());
    });

    $("#txtMessage").focusin(() => {
        socket.emit("client-send-user-is-typing");
    });

    $("#txtMessage").focusout(() => {
        socket.emit("client-send-user-stopped-type");
    });
});