import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { EmpleosEntity } from '../items/empleos/empleos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasantiaEntity } from '../items/pasantias/pasantias.entity';
import { ServiciosEntity } from '../items/servicios/servicio.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports:[
        TypeOrmModule.forFeature([EmpleosEntity, PasantiaEntity, ServiciosEntity]),
        ScheduleModule.forRoot(),
    ],
    providers:[CronsService]
})
export class CronsModule {}
