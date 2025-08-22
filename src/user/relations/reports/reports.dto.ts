import { IsNotEmpty, IsNumber, IsString, MaxLength } from "@nestjs/class-validator";

export class set_report_dto{
    
    @IsNumber()
    count_report:number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    type_report:string;

    @IsNumber()
    type_id:number;

    @IsString()
    @MaxLength(100)
    type_comentarie:string;

    @IsNumber()
    id_user:number;

}