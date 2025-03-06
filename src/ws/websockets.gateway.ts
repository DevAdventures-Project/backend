import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
@WebSocketGateway()
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  maps = ["HUB", "MAP1"];

  @WebSocketServer() io: Server;

  @SubscribeMessage("message")
  handleMessage(client: Socket, data: string): WsResponse<string> {
    const clientMapRooms = this.getClientMapRooms(client);
    console.log(
      `Client with id ${client.id} sent message ${data} to rooms ${clientMapRooms}`,
    );
    clientMapRooms.forEach((room: string) => {
      client.to(room).emit("message", data);
    });
    return {
      event: "sentMessage",
      data: "true",
    };
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, room: string) {
    console.log(`Client with id ${client.id} joined room ${room}`);
    const clientMapRooms = this.getClientMapRooms(client);
    if (clientMapRooms.length > 0 && this.maps.includes(room))
      return {
        event: "joinedRoom",
        data: "Already in a map room",
      };
    client.join(room);
    client.emit("joinedRoom", room);
  }

  @SubscribeMessage("leaveRooms")
  handleLeaveRooms(client: Socket) {
    console.log(`Client with id ${client.id} left all rooms`);
    client.rooms.forEach((room: string) => {
      client.leave(room);
    });
    client.emit("leftRooms", true);
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(client: Socket, room: string) {
    console.log(`Client with id ${client.id} left room ${room}`);
    client.leave(room);
    client.emit("leftRoom", room);
  }

  @SubscribeMessage("position")
  handlePosition(client: Socket, data: string): WsResponse<string> {
    const clientMapRooms = this.getClientMapRooms(client);
    console.log(
      `Client with id ${client.id} sent position ${data} to rooms ${clientMapRooms}`,
    );
    clientMapRooms.forEach((room: string) => {
      client.to(room).emit("position", data);
    });
    return {
      event: "sentPosition",
      data: "true",
    };
  }

  handleConnection(socket: WebSocket) {
    console.log("New connection");
  }

  handleDisconnect(socket: WebSocket) {
    console.log("Disconnected");
  }

  private getClientMapRooms(client: Socket) {
    return Array.from(client.rooms).filter((room: string) =>
      this.maps.includes(room),
    );
  }
}
