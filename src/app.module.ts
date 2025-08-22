import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './user/usuarios.entity';
import { PasantiaEntity } from './items/pasantias/pasantias.entity';
import { EmpleosModule } from './items/empleos/empleos.module';
import { EmpleosEntity } from './items/empleos/empleos.entity';
import { PasantiasModule } from './items/pasantias/pasantias.module';
import { UsuariosModule } from './user/usuarios.module';
import { AppDataSource } from './Zconfigs/data-source';
import { ServiciosModule } from './items/servicios/servicios.module';
import { ServiciosEntity } from './items/servicios/servicio.entity';
import { FavoritosEntity } from './user/relations/favorites/favoritos.entity';
import { CronsModule } from './cron-jobs/crons.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.develop.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    TypeOrmModule.forFeature([UsuarioEntity, PasantiaEntity,EmpleosEntity,ServiciosEntity,FavoritosEntity]),
    EmpleosModule,
    ServiciosModule,
    PasantiasModule,
    UsuariosModule,
    CronsModule,
    AuthModule,
  ],
})
export class AppModule {}
