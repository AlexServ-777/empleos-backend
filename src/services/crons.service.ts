import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { Repository, LessThan } from 'typeorm';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { ServiciosEntity } from '../entidades/servicio.entity';

@Injectable()
export class CronsService {
    constructor(
        @InjectRepository(EmpleosEntity)
        private readonly empleoRepo: Repository<EmpleosEntity>,

        @InjectRepository(PasantiaEntity)
        private readonly pasantiaRepo: Repository<PasantiaEntity>,

        @InjectRepository(ServiciosEntity)
        private readonly servicioRepo: Repository<ServiciosEntity>,
    ) { }

    @Cron('0 0 0 * * *')
    async delete_empleo_servicio_pasantia() {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate()-8);

        //eliminar empleos antiguos
        const empleosAntiguos = await this.empleoRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const empleo of empleosAntiguos){
            await this.empleoRepo.remove(empleo);
        }

        //eliminar pasantias antiguas
        const pasantiasAntiguas = await this.pasantiaRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const pasantia of pasantiasAntiguas){
            await this.pasantiaRepo.remove(pasantia);
        }

        //eliminar servicios antiguos
        const serviciosAntiguos = await this.servicioRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const servicio of serviciosAntiguos){
            await this.servicioRepo.remove(servicio);
        }
    }
}
