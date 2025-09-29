import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Client } from '../Clients/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
