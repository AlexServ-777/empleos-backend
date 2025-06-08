import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('session_logs')
export class SessionLogs{
    @PrimaryGeneratedColumn()
    id_registro:number;

    @Column()
    ip:string;

    @Column()
    fecha:Date;

    @Column()
    usuario:string;

    @Column()
    exito:boolean;
}