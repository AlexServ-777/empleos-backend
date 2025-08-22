import { IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsString, MaxLength } from "@nestjs/class-validator";

export class createPasantiaDTO{
        
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        titulo: string;
    
        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        categoria:string;
        
        @IsString()
        @IsNotEmpty()
        num_telf: string;

        @IsString()
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
}
export class updatePasantiaDTO extends createPasantiaDTO{
        @IsBoolean()
        isActive: boolean;
}
export class infoPasantiaDTO extends createPasantiaDTO{
        @IsString()
        @IsNotEmpty()
        id_pasantia:string;

        @IsBoolean()
        isActive: boolean;
        
        @IsDate()
        @IsNotEmpty()
        fecha_creacion:Date;

        @IsDate()
        @IsNotEmpty()
        fecha_modificacion:Date;
}
export class sanitizarPasantiaDTO{
        async sanitizar(data:any){
                const pasantia:infoPasantiaDTO = {
                        id_pasantia:data.id_pasantia,
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
                        fecha_creacion:data.fecha_creacion,
                        fecha_modificacion:data.fecha_modificacion,
                }
                return pasantia;
        }
}