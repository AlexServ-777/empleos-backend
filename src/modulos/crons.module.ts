import { Module } from '@nestjs/common';
import { CronsService } from '../services/crons.service';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { ServiciosEntity } from '../entidades/servicio.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports:[
        TypeOrmModule.forFeature([EmpleosEntity, PasantiaEntity, ServiciosEntity]),
        ScheduleModule.forRoot(),
    ],
    providers:[CronsService]
})
export class CronsModule {}
