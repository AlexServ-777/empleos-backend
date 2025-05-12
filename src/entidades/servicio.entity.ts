import { UsuarioEntity } from "./usuarios.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ServiciosEntity {
    @PrimaryGeneratedColumn()
    id_servicio: number;

    @Column({ nullable: false,length:50 })
    titulo: string;

    @Column({ nullable: false,length:50 })
    categoria: string;

    @Column({nullable:false})
    num_telf:number;

    @Column({ nullable: false })
    precio: number;

    @Column({ type:"enum",enum:['presencial','remoto','hibrido'],nullable:false})
    modalidad: string;

    @Column({ nullable: false,length:1000 })
    descripcion: string;

    @Column({ nullable: false,length:50 })
    ubicacion: string;

    @Column({nullable:false, length:50})
    ciudad: string;

    @Column({nullable:false,length:50})
    pais:string;

    @CreateDateColumn()
    fecha_creacion: Date;

    @UpdateDateColumn()
    fecha_modificacion:Date;

    @Column({ nullable: false,default:true })
    active: boolean;

    @ManyToOne(()=>UsuarioEntity,(usuario)=>usuario.servicios,{onDelete:'CASCADE'})
    user:UsuarioEntity;
}