import { IsDate, IsNotEmpty, IsNumber, IsObject, MaxLength } from "@nestjs/class-validator";

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

    @IsNumber()
    @IsNotEmpty()
    num_telf:number;

    @IsNumber()
    @IsNotEmpty()
    precio:number;

    @IsString()
    @IsNotEmpty()   
    @MaxLength(50)
    ciudad:string;

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
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    duracion:string;

    @IsDate()
    @IsNotEmpty()
    fecha_inicio:Date;

    @IsDate()
    @IsNotEmpty()
    fecha_fin:Date;
    
    @IsObject()
    @IsNotEmpty()
    user:object;
}
export class updateServicioDTO extends createServicioDTO{

}
export class getServicioDTO{
    sanitizar(data:any){
        const servicio:createServicioDTO = {
            titulo:data.titulo,
            categoria:data.categoria,
            num_telf:data.num_telf,
            precio:data.precio,
            ciudad:data.ciudad,
            pais:data.pais,
            descripcion:data.descripcion,
            modalidad:data.modalidad,
            duracion:data.duracion,
            fecha_inicio:data.fecha_inicio,
            fecha_fin:data.fecha_fin,
            user:{},
        }
        return servicio;
    }
}