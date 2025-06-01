import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosEntity } from '../entidades/servicio.entity';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { Repository } from 'typeorm';
import { createServicioDTO, sanitizarServicioDTO, updateServicioDTO } from 'src/dtos/servicios.dto';

@Injectable()
export class ServiciosSService {
    constructor(
        @InjectRepository(ServiciosEntity)
        private readonly serviciosRepository: Repository<ServiciosEntity>,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioEntity: Repository<UsuarioEntity>,
    ){}
    //GETS
    async getServiciosAll(): Promise<any> {
        //public
        const servicios = await this.serviciosRepository.find();
        const serviciosSanitizados = await Promise.all(servicios.map(servicio => new sanitizarServicioDTO().sanitizar(servicio)));
        return serviciosSanitizados;
    }
    async getServicioOne(id:any){
        //public
        const servicio = await this.serviciosRepository.findOneBy({id_servicio:id});
        const servicioSanitizado = new sanitizarServicioDTO().sanitizar(servicio);
        return servicioSanitizado;
    }
    async getServiciosUsuario(req:any){
        const serviciosUser = await this.usuarioEntity.findOne({where:{id_usuario:req.user.id},relations:['servicios']});
        const sanitizarServicios = await Promise.all(serviciosUser?.servicios.map(servicio=>new sanitizarServicioDTO().sanitizar(servicio))??[])
        return sanitizarServicios;
    }

    //POSTS
    async createServicio(data:createServicioDTO, req:any){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id});
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const newServicio = this.serviciosRepository.create(data);
        newServicio.user= usuario;
        newServicio.pais = usuario.pais;
        await this.serviciosRepository.save(newServicio);
        return{message:"servicio creado"};
    }

    //PUTS
    async updateServicio(id:any,data:updateServicioDTO, req:any){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id});
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const servicio = await this.serviciosRepository.findOne({where:{id_servicio:id},relations:['user']});
        if(!servicio){throw new NotFoundException('El servicio no existe')}
        if(servicio.user.id_usuario===req.user.id|| usuario.rol === 'admin'){
            await this.serviciosRepository.update(id,data);
            return{message:"Servicio actualizado"};
        }
        else{
            throw new ForbiddenException('No tienes permisos para esta accion');
        }
    }

    //DELETES
    async deleteServicio(id:any, req:any){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id});
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const servicio = await this.serviciosRepository.findOne({where:{id_servicio:id},relations:['user']});
        if(!servicio){throw new NotFoundException('El servicio no existe')}
        if(servicio?.user.id_usuario===usuario.id_usuario|| usuario?.rol === 'admin'){
            await this.serviciosRepository.delete(id);
            return{message:"Servicio eliminado"};
        }
        else{
            throw new NotFoundException('No tienes permisos para esta accion');
        }
    }

}
