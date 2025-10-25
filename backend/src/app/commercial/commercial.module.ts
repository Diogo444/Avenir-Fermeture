import { Module } from '@nestjs/common';
import { CommercialService } from './commercial.service';
import { CommercialController } from './commercial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commercial } from './entities/commercial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commercial])],
  controllers: [CommercialController],
  providers: [CommercialService],
})
export class CommercialModule {}
