import { IsEmail, IsNotEmpty, IsString, Max, MinLength } from "@nestjs/class-validator";
import {Exclude, Transform} from "class-transformer"
import { MaxLength } from "class-validator";

export class loginUserDTO{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    readonly email:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({value})=>value?.trim())
    readonly password:string;
}

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    apellido: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    nom_usuario: string;
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({value})=>value?.trim())
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @Transform(({value})=>value?.trim())
    rol:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Transform(({value})=>value?.trim())
    pais:string;
}

export class UpdateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    readonly apellido: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    readonly nom_usuario: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    @Transform(({value})=>value?.trim())
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
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