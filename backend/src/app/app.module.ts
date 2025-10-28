import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './Clients/client.module';
import { ProduitsModule } from './produits/produits.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CommercialModule } from './commercial/commercial.module';
import { AffaireModule } from './affaire/affaire.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'avenir_fermeture',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : true,
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
    ClientModule,
    ProduitsModule,
    DashboardModule,
    CommercialModule,
    AffaireModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
