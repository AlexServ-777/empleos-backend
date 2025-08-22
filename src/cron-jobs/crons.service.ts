import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpleosEntity } from '../items/empleos/empleos.entity';
import { Repository, LessThan } from 'typeorm';
import { PasantiaEntity } from '../items/pasantias/pasantias.entity';
import { ServiciosEntity } from '../items/servicios/servicio.entity';

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


    //cron de desactivacion
    @Cron('0 0 0 * * *') //cada dia osea a las 00:00:00
    async disabled_empleo_pasantia_servicio() {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate()-8);

        //desactivar empleos pasado 1 semana
        const empleosAntiguos = await this.empleoRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const empleo of empleosAntiguos){
            await this.empleoRepo.update(empleo.id_empleo,{isActive:false});
        }

        //desactivar pasantias pasado 1 semana
        const pasantiasAntiguas = await this.pasantiaRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const pasantia of pasantiasAntiguas){
            await this.pasantiaRepo.update(pasantia.id_pasantia,{isActive:false});
        }

        //desactivar servicios pasado 1 semana
        const serviciosAntiguos = await this.servicioRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const servicio of serviciosAntiguos){
            await this.servicioRepo.update(servicio.id_servicio, {isActive:false});
        }
    }

    //cron de eliminacion
    @Cron('0 0 0 * * *')
    async delete_empleo_servicio_pasantia(){
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate()-31);

        //eliminar empleos pasado 1 mes
        const empleosAntiguos = await this.empleoRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite),isActive:false}
        });
        for(const empleo of empleosAntiguos){
            await this.empleoRepo.delete(empleo.id_empleo);
        }

        //eliminar pasantias pasado 1 mes
        const pasantiasAntiguas = await this.pasantiaRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const pasantia of pasantiasAntiguas){
            await this.pasantiaRepo.delete(pasantia.id_pasantia);
        }

        //eliminar servicios pasado 1 mes
        const serviciosAntiguos = await this.servicioRepo.find({
            where:{fecha_modificacion:LessThan(fechaLimite)}
        });
        for(const servicio of serviciosAntiguos){
            await this.servicioRepo.delete(servicio.id_servicio);
        }
    }
}
