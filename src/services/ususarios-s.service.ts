import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
@Injectable()
export class UsusariosSService {    
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
        private jwtService:JwtService,

        @InjectRepository(EmpleosEntity)
        private readonly empleosRepository: Repository<EmpleosEntity>,

        @InjectRepository(FavoritosEntity)
        private readonly favoritosRepository: Repository<FavoritosEntity>,

        @InjectRepository(ServiciosEntity)
        private readonly serviciosRepository: Repository<ServiciosEntity>,

        @InjectRepository(PasantiaEntity)
        private readonly pasantiasRepository: Repository<PasantiaEntity>,

    ) {}

    getUsuarios(req) {
        const rolUser = req.user.rol;
        if(rolUser==='admin'){
            return this.usuarioRepository.find();
        }
        else{
            throw new ForbiddenException('No tienes autorizacion para esto');
        }
    }
    async getUser(req): Promise<CreateUsuarioDto> {
        const userIdToken = req.user.id;
        const user = await this.usuarioRepository.findOneBy({ id_usuario: userIdToken});
        if (!user) {
            throw new HttpException('Usuario no encontrado', 404);
        }
        const data:CreateUsuarioDto = await new userInfoDto().sanitizar(user);
        return data;
    }
    async getPaisUser(req){
        const user = await this.usuarioRepository.findOne({select:['pais'],where:{id_usuario:req.user.id}});
        if(!user) throw new NotFoundException('El usuario no existe');
        return {pais:user.pais};
    }

    async loginUser(usuarioData:loginUserDTO){
        const {email,password} = usuarioData;
        const user = await this.usuarioRepository.findOne({ where: { email } });
        if(!user) throw new HttpException('el usuario no existe',404);
        const passValidate = await compare(password,user?.password);
        if(!passValidate) throw new HttpException('contrasena incorrecta',404);
        
        const payload={ //el cuerpo del token 
            id:user.id_usuario,
            nom_user: user.nom_usuario,
            rol:user.rol
        }
        const token = await this.jwtService.sign(payload); //codificar el cuerpo payload
        //enviar el token al frontend
        return {message:"exito al logearse", token}
    }
    //creacion de usuarios que no se permiten crear admins
    async crearUsuario(usuarioData: CreateUsuarioDto) {
        //validar que no se puedan crear usuarios admin
        if(usuarioData.rol==='admin'|| usuarioData?.rol==undefined||usuarioData.rol==null){
            throw new ForbiddenException('no tienes autorizacion para crear un admin');
        }
        //encriptar la contrasena
        const password = usuarioData.password;
        const passEncrypt = await hash(password,10);
        usuarioData.password=passEncrypt;

        //crear el ususario
        const usuario:UsuarioEntity = this.usuarioRepository.create(usuarioData);
        await this.usuarioRepository.save(usuario);
        return {message:"Registro Exitoso"};
    }

    //creacion de usuarios admin y normales
    async crearUsuarioAdmin(usuarioData:CreateUsuarioDto, req){
        const adminId = req.user.id;
        const admin = await this.usuarioRepository.findOneBy({id_usuario:adminId})
        if(admin?.rol!=='admin'||!admin){
            throw new ForbiddenException('no eres admin, no puedes crear superUsuarios')
        }
        const password = usuarioData.password;
        const passEncrypt = await hash(password,10);
        usuarioData.password=passEncrypt;

        const newUser = await this.usuarioRepository.create(usuarioData);
        await this.usuarioRepository.save(newUser);
        return {message:"Registro exitoso"};
    }
    async eliminarUsuario(req) {
        const usuario = await this.usuarioRepository.findOne({ where:{id_usuario:req.user.id},relations:['empleos'] });
        if (!usuario) throw new NotFoundException('Ya no existe este usuario');
        const empleos = await this.empleosRepository.find({where:{user:{id_usuario:usuario.id_usuario}},relations:['user']})
        if(!empleos) throw new NotFoundException('El recurso ya no existe');
        await this.empleosRepository.remove(empleos);
        await this.usuarioRepository.remove(usuario);
        return { message: "exito" };
    }
    async actualizarUsuario(usuarioData: UpdateUsuarioDto, req) {
        console.log(usuarioData);
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
            throw new HttpException('Este recurso ya está en favoritos', 400);
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
        return { message: "Agregado a favoritos" };
    }
    async getFavoritos(req){
        const usuario = await this.usuarioRepository.findOneBy({id_usuario:req.user.id});
        if(!usuario) throw new NotFoundException('Usuario no encontrado');
        const favoritos = await this.favoritosRepository.find({where:{usuario:{id_usuario:usuario.id_usuario}},relations:['usuario','empleo','servicio','pasantia']});
        return favoritos;
    }
}