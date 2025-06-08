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
        private readonly serviciosRepository: Repository<ServiciosEntity>, //instanciamos la entidad para ser usada en este servicio
        @InjectRepository(UsuarioEntity)
        private readonly usuarioEntity: Repository<UsuarioEntity>, //instanciamos la entidad para ser usada en este servicio
    ){}
    //GETS
    async getServiciosAll(): Promise<any> {
        //public
        const servicios = await this.serviciosRepository.find(); //busca todos los servicios
        const serviciosSanitizados = await Promise.all(servicios.map(servicio => new sanitizarServicioDTO().sanitizar(servicio))); //sanitiza todos los servicios para no enviar datos sensibles
        return serviciosSanitizados; 
    }
    async getServicioOne(id:any){
        //public
        const servicio = await this.serviciosRepository.findOneBy({id_servicio:id}); //busca el servicio
        const servicioSanitizado = new sanitizarServicioDTO().sanitizar(servicio); //sanitizar para no enviar datos sensibles
        return servicioSanitizado;
    }
    async getServiciosUsuario(req:any){
        const serviciosUser = await this.usuarioEntity.findOne({where:{id_usuario:req.user.id},relations:['servicios']}); //busca al usuario y trate todos los servicios relacionados a este
        const sanitizarServicios = await Promise.all(serviciosUser?.servicios.map(servicio=>new sanitizarServicioDTO().sanitizar(servicio))??[]) //sanitiazar para no enviar datos sensibles
        return sanitizarServicios;
    }

    //POSTS
    async createServicio(data:createServicioDTO, req:any){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id}); //busca al usuario
        if(!usuario){throw new NotFoundException('El usuario no existe')}
        const newServicio = this.serviciosRepository.create(data); //crea la estructura de la entidad
        newServicio.user= usuario; //adiciona el user para ser relacionado corretamente
        newServicio.pais = usuario.pais; //adiciona el pais por si no se envia en el request
        await this.serviciosRepository.save(newServicio); //guardar la info en la BD
        return{message:"servicio creado"};
    }

    //PUTS
    async updateServicio(id:any,data:updateServicioDTO, req:any){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id}); //busca al usuario
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const servicio = await this.serviciosRepository.findOne({where:{id_servicio:id},relations:['user']}); //trae el servicio, y la info de su ralacion de user
        if(!servicio){throw new NotFoundException('El servicio no existe')}
        if(servicio.user.id_usuario===req.user.id|| usuario.rol === 'admin'){ //verifica si el user de servicio es igual al user que hizo la peticion
            await this.serviciosRepository.update(id,data);  //aatualiza
            return{message:"Servicio actualizado"}; 
        }
        else{
            throw new ForbiddenException('No tienes permisos para esta accion'); //si este recurso no le pertenede al usuario
        }
    }

    //DELETES
    async deleteServicio(id:any, req:any){
        const usuario = await this.usuarioEntity.findOneBy({id_usuario:req.user.id}); //busca al usuario segun el id del token
        if(!usuario){throw new NotFoundException('El usuario ya no existe')}
        const servicio = await this.serviciosRepository.findOne({where:{id_servicio:id},relations:['user']}); //busca el servicio y la info del usaurio relacionado
        if(!servicio){throw new NotFoundException('El servicio no existe')}
        if(servicio?.user.id_usuario===usuario.id_usuario|| usuario?.rol === 'admin'){
            await this.serviciosRepository.delete(id); //elimnar servicio
            return{message:"Servicio eliminado"};
        }
        else{
            throw new NotFoundException('No tienes permisos para esta accion'); //si este recurso no le pertenece al usuario
        }
    }
}
