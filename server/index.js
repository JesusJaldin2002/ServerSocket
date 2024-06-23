import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

const port = process.env.PORT ?? 8080; // Cambiar esto si voy a probar en localhost
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.0.9:8000", // Cambiar por la ip de la nube o del localhost
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
    origin: "http://192.168.0.9:8000", // Cambiar por la ip de la nube o del localhost
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
