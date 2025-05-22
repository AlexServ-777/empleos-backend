import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { console } from 'inspector';
import { createPasantiaDTO, infoPasantiaDTO, updatePasantiaDTO } from 'src/dtos/pasantias.dto';
import { PasantiaEntity } from 'src/entidades/pasantias.entity';
import { UsuarioEntity } from 'src/entidades/usuarios.entity';
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
    async getPasantias():Promise<any>{
        try{
            const pasantias = await this.pasantiaRepository.find();
            const pasantiasSanitizadas = await  Promise.all(pasantias.map(pasantia => new infoPasantiaDTO().sanitizar(pasantia)));
            return pasantiasSanitizadas;
        }catch(e){
            throw new InternalServerErrorException('OCURRIO UN ERROR INESPERADO');
        }
    }
    async getPasantiasUser(req:any){
        const usuario = await this.usuarioRespository.findOneBy({id_usuario:req.user.id});
        if(!usuario) throw new NotFoundException('El usuario no existe');
        const pasantias = await this.pasantiaRepository.find({where:{user:usuario},relations:['user']});
        if(!pasantias) throw new NotFoundException('No existen recursos');
        const pasantiasSanitizadas = await Promise.all(pasantias.map(pasantia => new infoPasantiaDTO().sanitizar(pasantia)));
        return pasantiasSanitizadas;
    }

    async getPasantiaService(id:number){
        const pasantia = await this.pasantiaRepository.findOneBy({id_pasantia:id});
        if(!pasantia) throw new NotFoundException('Este recurso no existe');
        const pasantiaSanitizada = new infoPasantiaDTO().sanitizar(pasantia);
        return pasantiaSanitizada;
    }

    //POSTS
    async createPasantia(data:createPasantiaDTO, req:any){
            const user = await this.usuarioRespository.findOneBy({id_usuario:req.user.id});
            if(!user) throw new NotFoundException('El usuario no existe');
            data.user = user;
            data.pais = user.pais;
            const newPasantia= this.pasantiaRepository.create(data);
            await this.pasantiaRepository.save(newPasantia);
            return {message:"exito"}
    }

    //PUTS
    async updatePasantia(data:updatePasantiaDTO,id:number,req:any){
        const user = await this.usuarioRespository.findOneBy({id_usuario:req.user.id});
        if(!user) throw new NotFoundException('El usuario ya no existe');
        const pasantia = await this.pasantiaRepository.findOne({where:{id_pasantia:id},relations:['user']});
        if(!pasantia) throw new NotFoundException('Este recurso ya no existe');
        if(user.id_usuario===pasantia.user?.id_usuario||user.rol==='admin')
        {
            await this.pasantiaRepository.update(id,data);
        }
        else{
            throw new ForbiddenException('NO TIENES PEMRMISOS PARA REALIZAR ESTA ACCION');
        }
    }
    //DELETES
    async deletePasantia(req,id){
        const user = await this.usuarioRespository.findOneBy({id_usuario:req.user.id});
        if(!user) throw new NotFoundException('El usuario no existe');
        const pasantia = await this.pasantiaRepository.findOne({where:{id_pasantia:id},relations:['user']});
        if(!pasantia) throw new NotFoundException('Esta publicacion ya no existe');
        if(user.id_usuario===pasantia.user?.id_usuario||user.rol==='admin'){
            await this.pasantiaRepository.remove(pasantia);
        }
        else{
            throw new ForbiddenException('No tienes permisos para hacer esta accion');
        }
    }

}
