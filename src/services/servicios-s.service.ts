import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosEntity } from '../entidades/servicio.entity';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { Repository } from 'typeorm';
import { createServicioDTO } from 'src/dtos/servicios.dto';

@Injectable()
export class ServiciosSService {
    constructor(
        @InjectRepository(ServiciosEntity)
        private readonly serviciosRepository: Repository<ServiciosEntity>,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioEntity: Repository<UsuarioEntity>,
    ){}
    //GETS
    async getServiciosAll(): Promise<ServiciosEntity[]> {
        //public
        const servicios = await this.serviciosRepository.find();
        return servicios;
    }
    async getServicioOne(id:any){
        //public
        const servicio = await this.serviciosRepository.findOneBy({id_servicio:id});
        return servicio;
    }
    async getServiciosUsuario(req){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id});
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const serviciosUser = await this.serviciosRepository.find({where:{user:usuario},relations:['user']});
        if(!serviciosUser){throw new NotFoundException('El usuario no tiene servicios')}
        if(serviciosUser[0].user.id_usuario === usuario.id_usuario|| usuario.rol === 'admin'){
            return serviciosUser;
        }
        else{
            throw new NotFoundException('No tinenes permisos para esta accion');
        }
    }

    //POSTS
    async createServicio(data:createServicioDTO, req){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id});
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const newServicio = this.serviciosRepository.create(data);
        newServicio.user= usuario;
        newServicio.pais = usuario.pais;
        await this.serviciosRepository.save(newServicio);
        return{message:"servicio creado"};
    }

    //PUTS
    async updateServicio(id:any,data:any, req){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id});
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const servicio = await this.serviciosRepository.findOne({where:{id_servicio:id},relations:['user']});
        if(!servicio){throw new NotFoundException('El servicio no existe')}
        if(servicio.user.id_usuario===req.user.id_usuario|| usuario.rol === 'admin'){
            await this.serviciosRepository.update(id,data);
            return{message:"Servicio actualizado"};
        }
        else{
            throw new NotFoundException('No tienes permisos para esta accion');
        }
    }

    //DELETES
    async deleteServicio(id:any, req){
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
