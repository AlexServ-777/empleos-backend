import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, isString, IsString, MaxLength } from "@nestjs/class-validator";
import { Exclude, plainToInstance } from "class-transformer";


export class createEmpleoDTO{
    @IsString()
    @MaxLength(50)
    titulo:string;
    
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    categoria:string;
    
    @IsNumber()
    @IsNotEmpty()
    salario:number;

    @IsNumber()
    @IsNotEmpty()
    num_telf: number;
    
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    modalidad:string;

    @IsString()
    @MaxLength(50)
    ciudad:string;

    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    ubicacion:string;

    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    pais:string;

    @IsString()
    @MaxLength(1000)
    @IsNotEmpty()
    requisitos: string;

    @IsString()
    @MaxLength(1000)
    @IsNotEmpty()
    descripcion: string;

    @IsBoolean()
    isActive: boolean;

    @IsObject()
    @IsNotEmpty()
    user:object;
}

export class updateEmpleoDTO extends createEmpleoDTO{
    //datos de la clase newEmpleoDTO    
}

export class getEmpleoDTO extends createEmpleoDTO{
    @IsDate()
    @IsNotEmpty()
    fecha_creacion: Date;

    @IsDate()
    @IsNotEmpty()
    fecha_publicacion: Date;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    id_empleo:string;
}
export class sanitizarEmpleoDTO{
    @Exclude()
    user:object;

    async sanitizar(data:any):Promise<getEmpleoDTO>{
        const empleoSanitizado:getEmpleoDTO = {
            id_empleo:data.id_empleo,
            titulo:data.titulo,
            categoria:data.categoria,
            salario:data.salario,
            num_telf:data.num_telf,
            modalidad:data.modalidad,
            ciudad:data.ciudad,
            ubicacion:data.ubicacion,
            pais:data.pais,
            requisitos:data.requisitos,
            descripcion:data.descripcion,
            fecha_creacion:data.fecha_creacion,
            fecha_publicacion:data.fecha_publicacion,
            isActive:data.isActive,
            user:{},
        };
        return empleoSanitizado;
    }
}