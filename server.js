const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 存储用户Socket
const userSockets = {};

io.on('connection', (socket) => {
  let userId = null;

  socket.on('login', (id) => {
    userId = id;
    if (!userSockets[userId]) userSockets[userId] = [];
    userSockets[userId].push(socket);
  });

  socket.on('text', (msg) => {
    if (userSockets[userId]) {
      userSockets[userId].forEach(s => s.emit('text', msg));
    }
  });

  socket.on('image', (imgURL) => {
    if (userSockets[userId]) {
      userSockets[userId].forEach(s => s.emit('image', imgURL));
    }
  });

  socket.on('disconnect', () => {
    if (userSockets[userId]) {
      userSockets[userId] = userSockets[userId].filter(s => s !== socket);
    }
  });
});

app.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});