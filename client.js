const socket = io();
let userId = null;

function login() {
  userId = document.getElementById("userid").value;
  socket.emit("login", userId);
}

function sendText() {
  const msg = document.getElementById("message").value;
  socket.emit("text", msg);
  document.getElementById("message").value = "";
}

function sendImage() {
  const file = document.getElementById("image").files[0];
  const formData = new FormData();
  formData.append("image", file);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      socket.emit("image", data.url);
    });
}

socket.on("text", (msg) => {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p>${msg}</p >`;
});

socket.on("image", (url) => {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p>< img src="${url}" width="200" /></p >`;
});