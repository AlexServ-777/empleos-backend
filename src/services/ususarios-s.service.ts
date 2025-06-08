import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsuarioEntity } from '../entidades/usuarios.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto, loginUserDTO, UpdateUsuarioDto, userInfoDto} from '../dtos/usuarios.dto';
import {hash,compare} from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmpleosEntity } from '../entidades/empleos.entity';
import { FavoritosEntity } from '../entidades/favoritos.entity';
import { ServiciosEntity } from '../entidades/servicio.entity';
import { PasantiaEntity } from '../entidades/pasantias.entity';
import { Request} from 'express';
@Injectable()
export class UsusariosSService {    
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        private jwtService:JwtService, //instanciamos el jwtService de la clase JwtService que contiene funcioens para el token

        @InjectRepository(EmpleosEntity)
        private readonly empleosRepository: Repository<EmpleosEntity>,

        @InjectRepository(FavoritosEntity)
        private readonly favoritosRepository: Repository<FavoritosEntity>,

        @InjectRepository(ServiciosEntity)
        private readonly serviciosRepository: Repository<ServiciosEntity>,

        @InjectRepository(PasantiaEntity)
        private readonly pasantiasRepository: Repository<PasantiaEntity>,

    ) {}

    async verificarToken(req:Request){
        const token = req?.cookies['token']; //obtener el token de req httponly, con Request de Express
        if(!token) throw new UnauthorizedException('NO HAY UN TOKEN'); //si es vacio osea undefined retornar que no hay autorizacion
        const decoded = await this.jwtService.verifyAsync(token); //verificar token
        if(!decoded){
            //no es validio
            console.log("invalid Token");
            throw new ForbiddenException('Token invalido');
        }
        //Es valido 200
        return {message:"exito"};
    }

    //obtener la info de todos los usuarios solo para admin
    getUsuarios(req:any) {
        const rolUser = req.user.rol;
        if(rolUser==='admin'){
            return this.usuarioRepository.find(); //retornamos los usuarios
        }
        else{
            throw new ForbiddenException('No tienes autorizacion para esto');
        }
    }

    //obtener la info de un usuario
    async getUser(req:any): Promise<CreateUsuarioDto> {
        const userIdToken = req.user.id; //buscamos el id del payload del token
        const user = await this.usuarioRepository.findOneBy({ id_usuario: userIdToken}); //buscamos el user dado el iduser del token
        if (!user) {
            throw new HttpException('Usuario no encontrado', 404); //si no existe 404
        }
        // Validar que el usuario solo pueda ver su propia información
        if (user.rol !== 'admin' && user.id_usuario !== userIdToken) { //verificar si es admin o si el id del token le pertenece al usuario
            throw new ForbiddenException('No tienes permiso para ver esta información');
        }
        const data:CreateUsuarioDto = await new userInfoDto().sanitizar(user); //sanitizamos para no mostrar datos sensibles
        return data;
    }
    async getPaisUser(req:any){
        const user = await this.usuarioRepository.findOne({select:['pais'],where:{id_usuario:req.user.id}}); //obtenemos el pais del user
        if(!user) throw new NotFoundException('El usuario no existe');
        return {pais:user.pais};
    }

    async loginUser(usuarioData:loginUserDTO){
        const {email,password} = usuarioData; //obtenemos los datos del logeo del front
        const user = await this.usuarioRepository.findOne({ where: { email } }); //buscamos al usuario segun su email
        if(!user) throw new HttpException('el usuario no existe',404); //si no existe 404
        const passValidate = await compare(password,user?.password); //si existe entonces compara la contrasena encripta con la contrasea del logeo del front
        if(!passValidate) throw new HttpException('usuario o contrasena incorrectos',404); //si no coindicen entonces retornar contrasena incorrecta
        
        //si todo fue valido crear el token para darle una sesion al user con el token
        const payload={ //el cuerpo del token 
            id:user.id_usuario,
            nom_user: user.nom_usuario,
            rol:user.rol
        }
        const token = this.jwtService.sign(payload); //codificar el cuerpo payload
        return token; //retornamos el token
    }

    //creacion de usuarios que no se permiten crear admins
    async crearUsuario(usuarioData: CreateUsuarioDto) {
        //validar que no se puedan crear usuarios admin
        if(usuarioData.rol==='admin'|| usuarioData?.rol==undefined||usuarioData.rol==null){ //si el rol fue alterado por x razon en el front validar aqui. Si el rol es undefined tiene accesso a admin asi que validar tambien eso
            throw new ForbiddenException('no tienes autorizacion para esta accion');
        }
        //validar que el usuario no exista
        const usuarioEmail = await this.usuarioRepository.findOneBy({email:usuarioData.email});
        if(usuarioEmail){
            throw new ConflictException('Este email ya esta registrado'); //409
        }
        const usuarioUsername = await this.usuarioRepository.findOneBy({nom_usuario:usuarioData.nom_usuario})
        if(usuarioUsername){
            throw new BadRequestException('El nombre de usuario ya esta en uso')
        }
        //encriptar la contrasena
        const password = usuarioData.password; //passwrod auxiliar
        const passEncrypt = await hash(password,10); //enriptar con la funcion has de bcryptjs
        usuarioData.password=passEncrypt; //guardamos la contrasena encriptada

        //crear el ususario
        const usuario:UsuarioEntity = this.usuarioRepository.create(usuarioData); //crear la estructura de la entidad
        await this.usuarioRepository.save(usuario); //guardamos en la BD
        return {message:"Registro Exitoso"};
    }

    //creacion de usuarios admin y normales
    async crearUsuarioAdmin(usuarioData:CreateUsuarioDto, req:any){
        const adminId = req.user.id; //obtenemos el id del usuario extraido del token
        const admin = await this.usuarioRepository.findOneBy({id_usuario:adminId}) //buscamos al user
        if(admin?.rol!=='admin'||!admin){ //si no es admin no puede crear otros admins
            throw new ForbiddenException('no eres admin, no puedes crear superUsuarios')
        }
        //validar que el usuario no exista
        const userExist = await this.usuarioRepository.findOneBy({email:usuarioData.email}); //si es admin entonces bucamos al usuario segun su email
        if(userExist){ //si existe entonces retornar 409
            throw new ConflictException('El usuario ya existe'); //409
        }
        const password = usuarioData.password; // password auxliar
        const passEncrypt = await hash(password,10); //encriptamos el password
        usuarioData.password=passEncrypt; //reasignamos el password a la estructura del deto

        const newUser = this.usuarioRepository.create(usuarioData); //crear la estrucutra de la entidad
        await this.usuarioRepository.save(newUser); //guardar el usuario
        return {message:"Registro exitoso"};
    }

    async eliminarUsuario(req:any) {
        const usuario = await this.usuarioRepository.findOne({ where:{id_usuario:req.user.id},relations:['empleos']});
        if (!usuario) throw new NotFoundException('El usuario no existe');
        await this.usuarioRepository.remove(usuario);
        return { message: "exito" };
    }
    async actualizarUsuario(usuarioData: UpdateUsuarioDto, req:any) {
        const usuarios = await this.usuarioRepository.findOneBy({ id_usuario: req.user.id });
        if (!usuarios) throw new NotFoundException('El usuario ya no existe');
        if(usuarioData.rol==='admin') throw new ForbiddenException('No tienes permido para hacer esto');
        await this.usuarioRepository.update(usuarios.id_usuario, usuarioData);
        return {message:"exito"};
    }

    async changePassword(req, data){
        const usuario = await this.usuarioRepository.findOneBy({id_usuario:req.user.id});
        if(!usuario) throw new NotFoundException('El usuario ya no existe');
        const passWordCompare = await compare(data.oldPass, usuario.password);
        if(!passWordCompare) throw new ForbiddenException('La contrasena actual es incorrecta');
        
        const newPass = await hash(data.newPass,10);
        await this.usuarioRepository.update({id_usuario:req.user.id}, {password:newPass});
        return {message:"exito"}
    }


    //FAVORITOS
    async setFavorito(req, data) {
        const { id_recurso, tipo_recurso } = data;
        const usuario = await this.usuarioRepository.findOneBy({ id_usuario: req.user.id });
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }
        // Verificar si ya existe el favorito
        const favoritoExistente = await this.favoritosRepository.findOne({
            where: {
                usuario: { id_usuario: usuario.id_usuario },
                tipo_favorito: tipo_recurso,
                ...(tipo_recurso === 'empleo' && { empleo: { id_empleo: id_recurso } }),
                ...(tipo_recurso === 'servicio' && { servicio: { id_servicio: id_recurso } }),
                ...(tipo_recurso === 'pasantia' && { pasantia: { id_pasantia: id_recurso } })
            },
            relations: ['usuario', 'empleo', 'servicio', 'pasantia']
        });

        if (favoritoExistente) {
            return {message:"Ya esta en favoritos", id_favorito:favoritoExistente.id_favorito, statusCode:400};
        }

        const newFavorito = this.favoritosRepository.create({
            tipo_favorito: tipo_recurso,
            usuario: usuario
        });

        // Establecer la relación según el tipo
        switch (tipo_recurso) {
            case 'empleo':
                const empleo = await this.empleosRepository.findOneBy({ id_empleo: id_recurso });
                if (!empleo) throw new NotFoundException('Empleo no encontrado');
                newFavorito.empleo = empleo;
                break;
            case 'servicio':
                const servicio = await this.serviciosRepository.findOneBy({ id_servicio: id_recurso });
                if (!servicio) throw new NotFoundException('Servicio no encontrado');
                newFavorito.servicio = servicio;
                break;
            case 'pasantia':
                const pasantia = await this.pasantiasRepository.findOneBy({ id_pasantia: id_recurso });
                if (!pasantia) throw new NotFoundException('Pasantía no encontrada');
                newFavorito.pasantia = pasantia;
                break;
            default:
                throw new HttpException('Tipo de recurso no válido', 400);
        }

        await this.favoritosRepository.save(newFavorito);
        return { message: "Agregado a favoritos",statusCode:200};
    }
    async getFavoritos(req){
        const usuario = await this.usuarioRepository.findOneBy({id_usuario:req.user.id});
        if(!usuario) throw new NotFoundException('Usuario no encontrado');
        const favoritos = await this.favoritosRepository.find({where:{usuario:{id_usuario:usuario.id_usuario}},relations:['usuario','empleo','servicio','pasantia']});
        return favoritos;
    }

    async eliminarFavorito(req:any,id:number){
        const favorito = await this.favoritosRepository.findOne({where:{id_favorito:id},relations:['usuario']});
        if(!favorito) throw new NotFoundException('Favorito no encontrado');
        if(favorito.usuario.id_usuario!==req.user.id){
            throw new ForbiddenException('No tienes permiso para eliminar este favorito');
        }
        await this.favoritosRepository.remove(favorito);
        return {message:"Se elimino de favoritos"};
    }

    async isFavorito(req:any, data:any){
        const {id_recurso, tipo_recurso} = data;
        const usuario = await this.usuarioRepository.findOneBy({id_usuario:req.user.id});
        if(!usuario) throw new NotFoundException('Usuario no encontrado');
        const favorito = await this.favoritosRepository.findOne({where:{usuario:{id_usuario:usuario.id_usuario},tipo_favorito:tipo_recurso,
            ...(tipo_recurso==='empleo' && {empleo:{id_empleo:id_recurso}}),
            ...(tipo_recurso==='servicio' && {servicio:{id_servicio:id_recurso}}),
            ...(tipo_recurso==='pasantia' && {pasantia:{id_pasantia:id_recurso}}),
        }});
        return favorito?true:false;
    }
}