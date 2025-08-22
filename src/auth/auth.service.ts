import { ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../user/usuarios.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioDto, loginUserDTO } from '../user/usuarios.dto';
import { compare } from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { Forgot_Password_Entity } from 'src/auth/forgot-password.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(Forgot_Password_Entity)
        private readonly forgotPassRepository: Repository<Forgot_Password_Entity>,

        private jwtService: JwtService,

        private configService:ConfigService,
        private resend:Resend = new Resend(this.configService.get<string>(process.env.RESEND_API_KEY!)),

    ) { }

    async verificarToken(req: Request) {
        const token = req?.cookies['tokenJWT']; //obtener el token de req httponly, con Request de Express
        if (!token) throw new UnauthorizedException('NO HAY UN TOKEN'); //si es vacio osea undefined retornar que no hay autorizacion
        const decoded = await this.jwtService.verifyAsync(token); //verificar token
        if (!decoded) {
            //no es validio
            console.log("invalid Token");
            throw new ForbiddenException('Token invalido');
        }
        //Es valido 200
        return { message: "exito" };
    }
    
    async loginUser(usuarioData: loginUserDTO) {
        const { email, password } = usuarioData; //obtenemos los datos del logeo del front
        const user = await this.usuarioRepository.findOne({ where: { email } }); //buscamos al usuario segun su email
        if (!user) throw new HttpException('el usuario no existe', 404); //si no existe 404
        const passValidate = await compare(password, user.password); //si existe entonces compara la contrasena encripta con la contrasea del logeo del front
        if (!passValidate) throw new HttpException('usuario o contrasena incorrectos', 404); //si no coindicen entonces retornar contrasena incorrecta

        //si todo fue valido crear el token para darle una sesion al user con el token
        const payload = { //el cuerpo del token 
            id: user.id_usuario,
            nom_user: user.nom_usuario,
            rol: user.rol
        }
        const token = this.jwtService.sign(payload); //codificar el cuerpo payload
        return token; //retornamos el token
    }

    //register google
    //esto es llamado en la estrategia o googleStrategy con su respectivo guard
    async validateGoogleUser(googleUser: CreateUsuarioDto) {
        const user = await this.usuarioRepository.findOneBy({ email: googleUser.email });
        //si existe el user, devolver el usuario en el request
        if(user)return user;
        //si no existe entonces crear al usuario y devolver su info pa logearlo
        const userCreate = this.usuarioRepository.create(googleUser);
        userCreate.nom_usuario = userCreate.email.split('@')[0];
        userCreate.password= bcrypt.hashSync(randomUUID(),10);
        const newUser = await this.usuarioRepository.save(userCreate);
        return newUser;
    }

    //inicio de sesion de google sin password
    async loginUserGoogle(email){
        const user = await this.usuarioRepository.findOneBy({email:email});
        if(!user) throw new NotFoundException('El usuario no existe');
        const payload = {
            id:user.id_usuario,
            nom_user:user.nom_usuario,
            rol:user.rol
        }
        const token = this.jwtService.sign(payload);
        return token;
    }


    //aun sin funcionar por falta de dominio
    async forgotPassword_send_email(to:string){
        const user = await this.usuarioRepository.findOneBy({email:to});
        if(!user) throw new NotFoundException('No se encontro una cuenta creada con este email');

        const token = crypto.randomUUID(); //crear un token random
        const expiration = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos 
        await this.forgotPassRepository.save({  //crear el registro en la bd
            user_id:user.id_usuario,
            email:user.email, //el email del user
            token:token, //el token random generado arriba
            expires_at: expiration  //el tiempo de expiracion
        });
        const {error} = await this.resend.emails.send({
            from:'jobget.soporte.contact@gmail.com',  //mi email
            to:[to],  //el email de destino
            subject:'SOLICITUD DE RESTABLECIMIENTO DE CONTRAÑA',  //Mensaje
            html:`
                <h1>REESTABLECER CONTRASEÑA</h1>
                <p>Haz click aqui
                <a href='https://${process.env.url_front}/user/passReset/forgotPassword-receibed?token=${token}'>Aqui</a>
                para reestablcer tu constraseña
                </p>
            `, //html que se mostrar en el correo enviado
        });
        if(error){
            throw new ConflictException('No se pudo enviar el email de recuperacion'); //si ocurrio un error
        }
        return {message:"Solicitud enviada"};
    }
}
