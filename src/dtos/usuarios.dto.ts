import { IsEmail, isObject, IsObject, IsString } from "@nestjs/class-validator";
import {Exclude} from "class-transformer"

export class loginUserDTO{
    @IsString()
    readonly email:string;

    @IsString()
    readonly password:string;
}

export class CreateUsuarioDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsString()
    nom_usuario: string;
    
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    rol:string;

    @IsString()
    pais:string;
}

export class UpdateUsuarioDto {
    @IsString()
    readonly nombre: string;

    @IsString()
    readonly apellido: string;

    @IsString()
    readonly nom_usuario: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly rol:string;
}
export class userInfoDto{
    async sanitizar(data:any):Promise<CreateUsuarioDto>{
        const userSafe:CreateUsuarioDto={
            nombre:data.nombre,
            apellido:data.apellido,
            nom_usuario:data.nom_usuario,
            email:data.email,
            password: "",
            rol:data.rol,
            pais:data.pais,
        }   
        return userSafe;    
    }
}