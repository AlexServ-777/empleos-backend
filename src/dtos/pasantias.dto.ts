import { IsBoolean, IsDate, IsEnum, IsIn, IsNotEmpty, IsNumber, IsObject, IsString, MaxLength } from "@nestjs/class-validator";

export class createPasantiaDTO{
        
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        titulo: string;
    
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        categoria:string;
        
        @IsNumber()
        @IsNotEmpty()
        num_telf: number;

        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        ubicacion: string;
    
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        ciudad:string;
    
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        pais:string

        @IsString()
        @IsNotEmpty()
        @MaxLength(1000)
        requisitos:string;

        @IsString()
        @IsNotEmpty()   
        @MaxLength(1000)
        descripcion: string;
        
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        modalidad:string;

        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        duracion:string

        @IsDate()
        @IsNotEmpty()
        fecha_inicio:Date;

        @IsDate()
        @IsNotEmpty()
        fecha_fin:Date;

        @IsBoolean()
        isActive: boolean;

        @IsObject()
        @IsNotEmpty()
        user:object;
}
export class updatePasantiaDTO extends createPasantiaDTO{

}
export class infoPasantiaDTO{
        sanitizar(data:any){
                const pasantia:createPasantiaDTO = {
                        titulo:data.titulo,
                        categoria:data.categoria,
                        num_telf:data.num_telf,
                        ubicacion:data.ubicacion,
                        ciudad:data.ciudad,
                        pais:data.pais,
                        requisitos:data.requisitos,
                        descripcion:data.descripcion,
                        modalidad:data.modalidad,
                        duracion:data.duracion,
                        fecha_inicio:data.fecha_inicio,
                        fecha_fin:data.fecha_fin,
                        isActive:data.isActive,
                        user:{},
                }
                return pasantia;
        }
}