import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportesEntity{
    @PrimaryGeneratedColumn()
    id_report:number;   //identificador del reporte

    @Column({type:'int'})
    type_id:number;  //id del empleo, pasantia, servicio

    @Column({length:20})
    type_report:string;  //empleo, pasantia, servicio

    @Column({type:'varchar', length:100})
    type_comentarie:string;  //tipo de reporte, por ejemplo: reporte por publicacion falsa o estafa

    @CreateDateColumn()
    create_date:Date;

    @Column({type:'int'})
    id_user: number;
}