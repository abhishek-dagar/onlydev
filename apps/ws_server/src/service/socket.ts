import { Server } from "socket.io";

class SocketService {
  private _io: Server;
  private static onlineUsers: { [key: string]: string } = {};
  private static connectedUsers: { [key: string]: String[] } = {};
  constructor() {
    this._io = new Server({
      cors: {
        origin: "*",
      },
    });
  }

  public initListeners() {
    const io = this._io;
    io.on("connection", (socket) => {
      console.log("new client connected", socket.id);
      socket.on("message", (data) => {
        io.emit("message", data);
      });
      socket.on("user-status", (data) => {
        io.emit("user-status", data);
      });

      socket.on("connect-notification", ({ roomId }) => {
        socket.join(roomId);
      });

      socket.on("notification", (data) => {
        io.to(data.roomId).emit("notification", data);
      });

      socket.on("connect-to-board-room", ({ roomId, userId }) => {
        if (SocketService.connectedUsers[roomId]) {
          SocketService.connectedUsers[roomId].push(userId);
        } else {
          SocketService.connectedUsers[roomId] = [userId];
        }
        socket.join(roomId);
        io.to(roomId).emit(
          "new-user-connected",
          SocketService.connectedUsers[roomId]
        );
      });

      socket.on("update-board", (data) => {
        const cursors = {
          ...data.otherCursors,
          [data.userId]: data.cursors[data.userId],
        };
        io.to(data.roomId).emit("update-board", {
          ...data,
          cursors,
          connectedUsers: SocketService.connectedUsers[data.roomId],
        });
      });

      socket.on("leave-board-room", ({ roomId, userId }) => {
        SocketService.connectedUsers[roomId]?.splice(
          SocketService.connectedUsers[roomId].indexOf(userId),
          1
        );
        io.to(roomId).emit("new-user-connected", SocketService.connectedUsers);
        socket.leave(roomId);
      });

      socket.on("disconnect", () => {
        console.log("client disconnected", socket.id);
      });
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
