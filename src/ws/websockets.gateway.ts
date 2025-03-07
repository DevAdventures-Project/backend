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
  players = new Map<string, string>();

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
    client.to(room).emit("joinedRoom", `${this.players.get(client.id)}`);
    console.log("joinRoom", client.rooms);
  }

  @SubscribeMessage("leaveRooms")
  async handleLeaveRooms(client: Socket) {
    console.log(`Client with id ${client.id} left all rooms`);
    await Promise.all(
      Array.from(client.rooms).map((room: string) => client.leave(room)),
    );
    const player = this.players.get(client.id);
    if(!player) return;
    this.io.sockets.emit("leftRooms", player);
  }

  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(client: Socket, room: string) {
    console.log(`Client with id ${client.id} left room ${room}`);
    await client.leave(room);
    client.emit("leftRoom", room);
    client.to(room).emit("leftRoom", `${this.players.get(client.id)}`);
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
    this.updatePlayerPosition(client, data);
    return {
      event: "sentPosition",
      data: "true",
    };
  }

  @SubscribeMessage("register")
  handleRegister(client: Socket, data: string) {
    console.log(`Client with id ${client.id} registered as ${data}`);
    const clientMapRooms = this.getClientMapRooms(client);
    this.players.set(client.id, data);
    client.to("HUB").emit("joinedRoom", data);
    client.emit("registered", data);
  }

  @SubscribeMessage("getOtherPlayers")
  handleGetOtherPlayers(client: Socket) {
    const mapRoom = this.getClientMapRooms(client)[0];
    const otherPlayers = this.getPlayersOnMap(mapRoom);
    console.log(JSON.stringify(otherPlayers.filter((player) => player !== this.players.get(client.id))))
    client.emit("otherPlayers", JSON.stringify(otherPlayers.filter((player) => player !== this.players.get(client.id))));
  }


  handleConnection(client: Socket) {
    client.join("HUB");
    console.log("New connection");
  }

  handleDisconnect(client: Socket) {
    const player = this.players.get(client.id);
    if(!player) return;
    this.io.sockets.emit("leftRooms", player);
    this.players.delete(client.id);
    console.log("Disconnected");
  }

  private getClientMapRooms(client: Socket) {
    return Array.from(client.rooms).filter((room: string) =>
      this.maps.includes(room),
    );
  }

  private getPlayersOnMap(map: string) {
    return Array.from(this.players).filter(
      ([clientId, _]) => {
        const clientSocket = this.io.sockets.sockets.get(clientId);
        return clientSocket ? this.getClientMapRooms(clientSocket).includes(map) : false;
      },
    ).map(([_, player]) => player);
  }

  private updatePlayerPosition(client: Socket, data: string) {
    const player = this.players.get(client.id);
    if (!player) return;
    const playerParsed = JSON.parse(player);
    const positions = JSON.parse(data);
    this.players.set(client.id, JSON.stringify({ ...playerParsed, ...positions }));
  }
}
