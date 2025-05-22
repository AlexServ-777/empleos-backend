import { IsEmail, IsNotEmpty, isObject, IsObject, IsString, MinLength } from "@nestjs/class-validator";
import {Exclude} from "class-transformer"

export class loginUserDTO{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    readonly password:string;
}

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsString()
    @IsNotEmpty()
    nom_usuario: string;
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    rol:string;

    @IsString()
    @IsNotEmpty()
    pais:string;
}

export class UpdateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly apellido: string;

    @IsString()
    @IsNotEmpty()
    readonly nom_usuario: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly rol:string;
}
export class userInfoDto{
    @Exclude()
    password: string;

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