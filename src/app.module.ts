import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entidades/usuarios.entity';
import { PasantiaEntity } from './entidades/pasantias.entity';
import { EmpleosModule } from './modulos/empleos.module';
import { EmpleosEntity } from './entidades/empleos.entity';
import { PasantiasModule } from './modulos/pasantias.module';
import { UsuariosModule } from './modulos/usuarios.module';
import { AppDataSource } from './Zconfigs/data-source';
import { ServiciosModule } from './modulos/servicios.module';
import { ServiciosEntity } from './entidades/servicio.entity';
import { FavoritosEntity } from './entidades/favoritos.entity';

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
  ],
})
export class AppModule {}
