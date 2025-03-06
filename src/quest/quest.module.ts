import { Module } from '@nestjs/common';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [QuestController],
    providers: [QuestService],
    imports: [PrismaModule],
})
export class QuestModule {}