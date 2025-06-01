import { IsEmail, IsNotEmpty, isObject, IsObject, IsString, MinLength } from "@nestjs/class-validator";
import {Exclude, Transform} from "class-transformer"

export class loginUserDTO{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({value})=>value?.trim())
    readonly email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Transform(({value})=>value?.trim())
    readonly password:string;
}

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    apellido: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    nom_usuario: string;
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    password: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    rol:string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    pais:string;
}

export class UpdateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    readonly apellido: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    readonly nom_usuario: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({value})=>value?.trim())
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
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