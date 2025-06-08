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
        private readonly empleosRepository: Repository<EmpleosEntity>, // instanciamos e inicializamos un repositorio con la entidad empleos para poder ser usada en el servicio

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository : Repository<UsuarioEntity>, //instanciamos la entidad usuario
    ){}
    //gets
    async getEmpleos():Promise<any>{
        const empleos = await this.empleosRepository.find(); //buscamos todos los empleos
        const empleosSanitizados = await Promise.all(empleos.map(empleo => new sanitizarEmpleoDTO().sanitizar(empleo))); //sanitizamos cada empleos
        return empleosSanitizados;
    }
    //get para empleos del usuario
    async getEmpleosUser(req:any):Promise<any>{
        const empleosUser = await this.usuarioRepository.findOne({where:{id_usuario:req.user.id}, relations:['empleos']}); //buscamos al usuarios y traemos todos los empleos relacionados
        const empleosSanitizados = await Promise.all(empleosUser?.empleos.map(empleo => new sanitizarEmpleoDTO().sanitizar(empleo))??[]); //sanitiazamos
        return empleosSanitizados;
    }
    //get para mostrar detaller de un empleo (publico)
    async getEmpleoInformacion(id:number):Promise<any>{
        const empleo = await this.empleosRepository.findOne({where:{id_empleo:id}}); //buscar la informacion de un empleo
        if(!empleo) throw new NotFoundException('No existe el recurso');
        const empleoSanitizado = await new sanitizarEmpleoDTO().sanitizar(empleo); //sanitizar
        return empleoSanitizado;
    }

    async createEmpleo(empleoData: createEmpleoDTO, req:any){
        const user = await this.usuarioRepository.findOneBy({id_usuario:req.user.id}); //buscamos el usuario
        if(!user) throw new HttpException('EL USUARIO NO EXISTE',404);
        const empleoCreate = this.empleosRepository.create(empleoData); //creamos la estrucutura de la entidad
        empleoCreate.pais=user.pais; //agregamos pais
        empleoCreate.user= user; //agremos el usuario para poder ser relacionado
        await this.empleosRepository.save(empleoCreate); //guardamos el empleo en la DB
        return {message:"ok"};
    }

    async updateEmpleoService(data:updateEmpleoDTO, req:any,id:number){
        const user = await this.usuarioRepository.findOneBy({id_usuario:req.user.id}) //buscamos al user
        if(!user) throw new NotFoundException('El usuario ya no existe'); 
        const empleo = await this.empleosRepository.findOne({where:{id_empleo:id},relations:['user']}); //buscamos el empleos y su relacion con el user 
        if(!empleo) throw new NotFoundException('El recurso no existe');
        if(empleo.user.id_usuario===user.id_usuario||user.rol==='admin'){ //verificamos que el user foraneo de empleo es igual al user del token
            await this.empleosRepository.update(id,data); //si le pertence entonces actualizamos
            return {message:"empleo actualizado"} 
        }
        else{
            throw new ForbiddenException('no tienes autorizacion para hacer esto')
        }
    }

    async deleteEmpleoService(req:any,id:number){
        //si o si relacionar las tablas en cada peticion para obtener los datos correctos
        const user = await this.usuarioRepository.findOneBy({id_usuario:req.user.id}); //buscamos al user
        if (!user) throw new HttpException('El usuario no existe', 404);

        //aqui traigo el usuario relacinado con este empleo, ya que si no empleo.user sera undefinded
        const empleo = await this.empleosRepository.findOne({where:{id_empleo:id},relations:['user']}); //buscamos el empleo y su usario relacionado
        if(!empleo) throw new NotFoundException('Ya no existe este recurso');
        if(empleo.user.id_usuario === user.id_usuario||user.rol==='admin'){ //verificamos si le pertenece
            await this.empleosRepository.delete(id); //si es asi entonces se borra
            return {message:"empleo eliminado"}
        }
        else{
            throw new ForbiddenException('No tienes autorizacion para hacer esto');
        }
    }
}