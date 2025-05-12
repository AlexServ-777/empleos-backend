import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Timestamp, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioEntity } from './usuarios.entity';
@Entity()
export class EmpleosEntity {

    @PrimaryGeneratedColumn()
    id_empleo: number;

    @Column({length:50, nullable: false })
    titulo: string;

    @Column({nullable:false, length:50})
    categoria:string;

    @Column({nullable: true })
    salario: number;

    @Column({nullable:false, type:"bigint"})
    num_telf: number;

    @Column({ type:"enum",enum:['presencial','remoto','hibrido'],nullable:false})
    modalidad:string

    @Column({nullable: false, length:50})
    ciudad: string;

    @Column({length:50, nullable: false })
    ubicacion: string;

    @Column({nullable:false, length:300})
    pais:string;

    @Column({length:1000, nullable: false })
    requisitos: string;

    @Column({length:1000,nullable: false })
    descripcion: string;

    @CreateDateColumn()
    fecha_creacion: Date;

    @UpdateDateColumn()
    fecha_modificacion: Date;

    @Column({ nullable: false,default:true })
    isActive: boolean;

    // relación
    @ManyToOne(()=>UsuarioEntity,(user)=>user.empleos,{onDelete:'CASCADE'})
    user:UsuarioEntity;
}