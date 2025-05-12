import { IsBoolean, IsDate, IsNumber, IsObject, IsString } from "@nestjs/class-validator";


export class createEmpleoDTO{
    @IsString()
    titulo:string;
    
    @IsString()
    categoria:string;
    
    @IsNumber()
    salario:number;

    @IsNumber()
    num_telf: number;
    
    @IsString()
    modalidad:string;

    @IsString()
    ciudad:string;

    @IsString()
    ubicacion:string;

    @IsString()
    pais:string;

    @IsString()
    requisitos: string;

    @IsString()
    descripcion: string;

    @IsBoolean()
    isActive: boolean;

    @IsObject()
    user:object;
}

export class updateEmpleoDTO extends createEmpleoDTO{
    //datos de la clase newEmpleoDTO    
}

export class getEmpleoDTO extends createEmpleoDTO{
    @IsDate()
    fecha_creacion: Date;

    @IsDate()
    fecha_publicacion: Date;
}
