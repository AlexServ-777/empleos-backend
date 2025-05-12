import { IsBoolean, IsDate, IsEnum, IsIn, IsNumber, IsObject, IsString } from "@nestjs/class-validator";

export class createPasantiaDTO{
        
        @IsString()
        titulo: string;
    
        @IsString()
        categoria:string;
        
        @IsNumber()
        num_telf: number;

        @IsString()
        ubicacion: string;
    
        @IsString()
        ciudad:string;
    
        @IsString()
        pais:string

        @IsString()
        requisitos:string;

        @IsString()
        descripcion: string;
        
        @IsString()
        modalidad:string;

        @IsString()
        duracion:string

        @IsDate()
        fecha_inicio:Date;

        @IsDate()
        fecha_fin:Date;

        @IsBoolean()
        isActive: boolean;

        @IsObject()
        user:object;
}
export class updatePasantiaDTO{
}
export class infoPasantiaDTO{
}