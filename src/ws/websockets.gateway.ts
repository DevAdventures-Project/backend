import {
  ConnectedSocket,
  MessageBody,
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
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): WsResponse<string> {
    console.log("message", client.rooms);
    const clientMapRooms = this.getClientMapRooms(client);
    console.log(
      `Client with id ${client.id} sent message ${data} to rooms ${clientMapRooms}`,
    );
    clientMapRooms.forEach((room: string) => {
      console.log(`Sending message to room ${room}`);
      console.log(client.to(room).emit("message", data));
    });
    return {
      event: "message",
      data,
    };
  }

  @SubscribeMessage("joinRoom")
  async handleJoinRoom(client: Socket, room: string) {
    console.log(`Client with id ${client.id} joined room ${room}`);
    const clientMapRooms = this.getClientMapRooms(client);
    if (clientMapRooms.length > 0 && this.maps.includes(room))
      return {
        event: "joinedRoom",
        data: "Already in a map room",
      };
    await client.join(room);
    console.log("joinRoom", client.rooms);
    client.emit("joinedRoom", room);
  }

  @SubscribeMessage("leaveRooms")
  async handleLeaveRooms(client: Socket) {
    console.log(`Client with id ${client.id} left all rooms`);
    await Promise.all(
      Array.from(client.rooms).map((room: string) => client.leave(room)),
    );
    client.emit("leftRooms", true);
  }

  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(client: Socket, room: string) {
    console.log(`Client with id ${client.id} left room ${room}`);
    await client.leave(room);
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

  @SubscribeMessage("joinQuestRoom")
  async handleJoinQuestRoom(
    client: Socket,
    payload: { questId: string; user: { id: string; pseudo: string } },
  ) {
    const { questId, user } = payload;
    console.log(`Client with id ${client.id} joined quest room ${questId}`);
    await client.join(questId);
    client.emit("joinedQuestRoom", questId);
    client.to(questId).emit("newMemberJoined", user);
  }

  @SubscribeMessage("leaveQuestRoom")
  async handleLeaveQuestRoom(
    client: Socket,
    payload: { questId: string; user: { id: string; pseudo: string } },
  ) {
    const { questId, user } = payload;
    console.log(`Client with id ${client.id} left quest room ${questId}`);
    await client.leave(questId);
    client.emit("leftQuestRoom", questId);
    client.to(questId).emit("memberLeft", user);
  }

  @SubscribeMessage("sendQuestMessage")
  handleSendQuestMessage(
    client: Socket,
    payload: {
      questId: string;
      message: {
        content: string;
        author: { id: string; pseudo: string };
        createdAt: string;
        quest: { id: string; title: string };
      };
    },
  ): WsResponse<string> {
    const { questId, message } = payload;
    console.log(
      `Client with id ${client.id} sent message to quest room ${questId}`,
    );
    client.to(questId).emit("questMessage", message);
    return {
      event: "questMessageSent",
      data: "Message sent to quest room",
    };
  }

  handleConnection(client: Socket) {
    client.join("HUB");
    console.log("New connection");
  }

  handleDisconnect(client: Socket) {
    this.handleLeaveRooms(client);
    console.log("Disconnected");
  }

  private getClientMapRooms(client: Socket) {
    return Array.from(client.rooms).filter((room: string) =>
      this.maps.includes(room),
    );
  }
}
