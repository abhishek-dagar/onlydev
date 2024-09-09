import http from "http";
import SocketService from "./service/socket";
async function init() {
  // Create an instance of the SocketService
  const socketService = new SocketService();

  // Create a new HTTP server
  const server = http.createServer();

  // Define the port to listen on
  const port = process.env.PORT || 3000;

  // Attach CORS policy to the socket.io instance
  socketService.io.attach(server, {
    cors: {
      origin: "*", // Allow all origins, or replace with specific domains
      methods: ["GET", "POST"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
      credentials: true, // Allow credentials if needed
    },
  });

  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });

  // Initialize listeners after attaching the server
  socketService.initListeners();
}

init();
