import { ApiProperty } from "@nestjs/swagger";
import { Message, Quest, User, UserQuestRank } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
import { MessageEntity } from "../../chat/entities/message.entity";
import { QuestEntity } from "../../quest/entities/quest.entity";
import { UserQuestRankEntity } from "./user-quest-rank.entity";

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  pseudo: string;

  @Exclude()
  password: string;

  @ApiProperty()
  coins: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    type: [QuestEntity],
    description: "Quêtes créées par l'utilisateur",
  })
  @Type(() => QuestEntity)
  questsCreated?: Quest[];

  @ApiProperty({
    type: [QuestEntity],
    description: "Quêtes où l'utilisateur est helper",
  })
  @Type(() => QuestEntity)
  questsHelped?: Quest[];

  @ApiProperty({
    type: [MessageEntity],
    description: "Messages de l'utilisateur",
  })
  @Type(() => MessageEntity)
  messages?: Message[];

  @ApiProperty({
    type: [UserQuestRankEntity],
    description: "Ranks de l'utilisateur",
  })
  @Type(() => UserQuestRankEntity)
  ranks?: UserQuestRank[];
}
