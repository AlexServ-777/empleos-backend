import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPasantiaDTO, sanitizarPasantiaDTO, updatePasantiaDTO } from '../dtos/pasantias.dto';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class PasantiasSService {
    constructor(
        @InjectRepository(PasantiaEntity)
        private readonly pasantiaRepository: Repository<PasantiaEntity>,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRespository:Repository<UsuarioEntity>,
    ){}
    
    //GETS
    //obtener las pasantias para el publico
    async getPasantias():Promise<any>{
        try{
            const pasantias = await this.pasantiaRepository.find(); //buscamos todas las pasantia
            const pasantiasSanitizadas = await  Promise.all(pasantias.map(pasantia => new sanitizarPasantiaDTO().sanitizar(pasantia))); //sanitizar cada pasantia
            return pasantiasSanitizadas;
        }catch(e){
            throw new InternalServerErrorException('OCURRIO UN ERROR INESPERADO');
        }
    }

    //obtener la info de todas las pasantias de un usuario
    async getPasantiasUser(req:any){
        const pasantiasUser = await this.usuarioRespository.findOne({where:{id_usuario:req.user.id}, relations:['pasantias']}); //buscamos al usuario y todas sus relaciones de pasantia
        const pasantiasSanitizadas = await Promise.all(pasantiasUser?.pasantias.map(pasantia => new sanitizarPasantiaDTO().sanitizar(pasantia))??[]); //sanitizamos todas sus pasantias
        return pasantiasSanitizadas;
    }

    //obtener la info de una pasantia
    async getPasantiaService(id:number){
        const pasantia = await this.pasantiaRepository.findOneBy({id_pasantia:id}); //obtenemos una pasantia
        if(!pasantia) throw new NotFoundException('Este recurso no existe');
        const pasantiaSanitizada = new sanitizarPasantiaDTO().sanitizar(pasantia);//sanitizar segun el dto
        return pasantiaSanitizada;
    }

    //POSTS
    //creamos la pasantia
    async createPasantia(data:createPasantiaDTO, req:any){
            const user = await this.usuarioRespository.findOneBy({id_usuario:req.user.id}); //buscamos al user
            if(!user) throw new NotFoundException('El usuario no existe');
            const newPasantia= this.pasantiaRepository.create(data); //creamos la estructura de la entidad
            newPasantia.user=user; //insertamos el user a la pasantia para poder ser relacinado con el user
            newPasantia.pais=user.pais; //insertamos el pais
            await this.pasantiaRepository.save(newPasantia); //guaradmos en la bd
            return {message:"exito"}
    }

    //PUTS
    //actualizamos la pasantia
    async updatePasantia(data:updatePasantiaDTO,id:number,req:any){
        const user = await this.usuarioRespository.findOneBy({id_usuario:req.user.id}); //buscamos al user
        if(!user) throw new NotFoundException('El usuario ya no existe'); 
        const pasantia = await this.pasantiaRepository.findOne({where:{id_pasantia:id},relations:['user']}); //buscamos la pasantia y su usuario relacionado
        if(!pasantia) throw new NotFoundException('Este recurso ya no existe');
        if(user.id_usuario===pasantia.user?.id_usuario||user.rol==='admin') //verificamos el user con el user de la pasantia
        {
            await this.pasantiaRepository.update(id,data); //actualizar si son identicos
            return {message:'pasantia actualizado'}
        }
        else{
            throw new ForbiddenException('NO TIENES PEMRMISOS PARA REALIZAR ESTA ACCION');
        }
    }
    //DELETES
    async deletePasantia(req:any,id:number){
        const user = await this.usuarioRespository.findOneBy({id_usuario:req.user.id}); //buscamos al user
        if(!user) throw new NotFoundException('El usuario no existe');
        const pasantia = await this.pasantiaRepository.findOne({where:{id_pasantia:id},relations:['user']}); //buscamos la pasantia con su usuario relacionado
        if(!pasantia) throw new NotFoundException('Esta publicacion ya no existe');
        if(user.id_usuario===pasantia.user?.id_usuario||user.rol==='admin'){ //verificamos si le pertenece al usuario
            await this.pasantiaRepository.remove(pasantia); //borramos si es asi
            return {message:"pasantia eliminado"}
        }
        else{
            throw new ForbiddenException('No tienes permisos para hacer esta accion');
        }
    }

}
