import { Module } from '@nestjs/common';
import { TitresService } from './titres.service';
import { TitresController } from './titres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titre } from './entities/titre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Titre])],
  controllers: [TitresController],
  providers: [TitresService],
})
export class TitresModule {}
