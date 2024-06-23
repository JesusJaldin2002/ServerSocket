import express from "express";
import fs from "fs";
import https from "https";
import logger from "morgan";
import { Server } from "socket.io";
import cors from "cors";

// Certificados SSL
const privateKey = fs.readFileSync('/etc/letsencrypt/live/servidor-socket.duckdns.org/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/servidor-socket.duckdns.org/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/servidor-socket.duckdns.org/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const port = process.env.PORT ?? 8080;
const app = express();
const server = https.createServer(credentials, app);
const io = new Server(server, {
  cors: {
    origin: "https://proyectosw1.xyz", // Cambiar por tu dominio de Laravel
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.on("message", (data) => {
    io.emit("message", data); // Emitir el mensaje a todos los clientes conectados
  });

  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
  });

  socket.on("disconnecting", () => {
    console.log("Desconectando cliente");
  });
});

app.use(logger("dev"));

// Habilitar CORS para todas las solicitudes
app.use(
  cors({
    origin: "https://proyectosw1.xyz", // Cambiar por tu dominio de Laravel
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running on https://servidor-socket.duckdns.org:${port}`);
});
