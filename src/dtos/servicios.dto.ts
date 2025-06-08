import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, MaxLength } from "@nestjs/class-validator";

import { IsString } from "@nestjs/class-validator";

export class createServicioDTO{
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    titulo:string;

    @IsString() 
    @IsNotEmpty()
    @MaxLength(50)
    categoria:string;

    @IsString()
    @MaxLength(20)
    @IsNotEmpty()
    num_telf:string;

    @IsString()
    @MaxLength(20)
    @IsNotEmpty()
    precio:string;

    @IsString()
    @IsNotEmpty()   
    @MaxLength(50)
    ciudad:string;

    @IsString()
    @MaxLength(50)
    ubicacion:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    pais:string;    

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    descripcion:string;     
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    modalidad:string;
}
export class updateServicioDTO extends createServicioDTO{
    @IsBoolean()
    @IsNotEmpty()
    isActive:boolean;
}
export class getServicioDTO extends createServicioDTO{
    @IsNumber()
    @IsNotEmpty()
    id_servicio:number;

    @IsBoolean()
    @IsNotEmpty()
    isActive:boolean
    
    @IsDate()
    @IsNotEmpty()
    fecha_creacion:Date;
    
    @IsDate()
    @IsNotEmpty()
    fecha_modificacion:Date;
}
export class sanitizarServicioDTO{
    sanitizar(data:any){
        const servicio:getServicioDTO = {
            id_servicio:data.id_servicio,
            titulo:data.titulo,
            categoria:data.categoria,
            num_telf:data.num_telf,
            precio:data.precio,
            ciudad:data.ciudad,
            ubicacion:data.ubicacion,
            pais:data.pais,
            descripcion:data.descripcion,
            modalidad:data.modalidad,
            fecha_creacion:data.fecha_creacion,
            fecha_modificacion:data.fecha_modificacion,
            isActive:data.isActive
        }
        return servicio;
    }
}