import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { Repository } from 'typeorm'
import { createEmpleoDTO,sanitizarEmpleoDTO,updateEmpleoDTO } from '../dtos/empleos.dto';
import { UsuarioEntity } from '../entidades/usuarios.entity';

@Injectable()
export class EmpleosSService {
    constructor(
        @InjectRepository(EmpleosEntity)
        private readonly empleosRepository: Repository<EmpleosEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository : Repository<UsuarioEntity>,
    ){}
    //gets
    async getEmpleos():Promise<any>{
        const empleos = await this.empleosRepository.find();
        const empleosSanitizados = await Promise.all(empleos.map(empleo => new sanitizarEmpleoDTO().sanitizar(empleo)));
        return empleosSanitizados;
    }
    //get para empleos del usuario
    async getEmpleosUser(req:any):Promise<any>{
        const empleosUser = await this.usuarioRepository.findOne({where:{id_usuario:req.user.id}, relations:['empleos']});
        const empleosSanitizados = await Promise.all(empleosUser?.empleos.map(empleo => new sanitizarEmpleoDTO().sanitizar(empleo))??[]);
        return empleosSanitizados;
    }
    //get para mostrar detaller de un empleo (publico)
    async getEmpleoInformacion(id:number):Promise<any>{
        const empleo = await this.empleosRepository.findOne({where:{id_empleo:id}});
        if(!empleo) throw new NotFoundException('No existe el recurso');
        const empleoSanitizado = await new sanitizarEmpleoDTO().sanitizar(empleo);
        return empleoSanitizado;
    }

    async createEmpleo(empleoData: createEmpleoDTO, req:any){
        const user = await this.usuarioRepository.findOneBy({id_usuario:req.user.id});
        if(!user) throw new HttpException('EL USUARIO NO EXISTE',404);
        empleoData.user = user;
        empleoData.pais = user.pais;
        const empleoCreate = this.empleosRepository.create(empleoData);
        await this.empleosRepository.save(empleoCreate);
        return {message:"ok"};
    }

    async updateEmpleoService(data:updateEmpleoDTO, req:any,id:number){
        const user = await this.usuarioRepository.findOneBy({id_usuario:req.user.id})
        if(!user) throw new NotFoundException('El usuario ya no existe');
        const empleo = await this.empleosRepository.findOne({where:{id_empleo:id},relations:['user']}); 
        if(!empleo) throw new NotFoundException('El recurso ya no existe');
        if(empleo.user.id_usuario===user.id_usuario||user.rol==='admin'){
            await this.empleosRepository.update(id,data);
            return {message:"exito"} 
        }
        else{
            throw new ForbiddenException('no tienes autorizacion para hacer esto')
        }
    }

    async deleteEmpleoService(req:any,id:number){
        //si o si relacionar las tablas en cada peticion para obtener los datos correctos
        const user = await this.usuarioRepository.findOneBy({id_usuario:req.user.id});
        if (!user) throw new HttpException('El usuario ya no existe', 404);
        //aqui traigo el usuario relacinado con este empleo, ya que si no empleo.user sera undefinded
        const empleo = await this.empleosRepository.findOne({where:{id_empleo:id},relations:['user']});
        if(!empleo) throw new NotFoundException('Ya no existe este recurso');
        if(empleo.user.id_usuario === user.id_usuario){
            await this.empleosRepository.delete(id);
            return {message:"exito"}
        }
        else{
            throw new ForbiddenException('No tienes autorizacion para hacer esto');
        }
    }
}