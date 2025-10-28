import { Module } from '@nestjs/common';
import { AffaireService } from './affaire.service';
import { AffaireController } from './affaire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affaire } from './entities/affaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Affaire ])],
  controllers: [AffaireController],
  providers: [AffaireService],
})
export class AffaireModule {}
