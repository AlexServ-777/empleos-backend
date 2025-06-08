import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Timestamp, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UsuarioEntity } from './usuarios.entity';
import { FavoritosEntity } from './favoritos.entity';
@Entity()
export class EmpleosEntity {

    @PrimaryGeneratedColumn()
    id_empleo: number;

    @Column({length:50, nullable: false })
    titulo: string;

    @Column({nullable:false, length:50})
    categoria:string;

    @Column({nullable: true, type:"bigint" })
    salario: number;

    @Column({nullable:false, length:30})
    num_telf: string;

    @Column({ type:"enum",enum:['Presencial','Remoto','Hibrido'],nullable:false})
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

    @OneToMany(() => FavoritosEntity, (favorito) => favorito.empleo, {cascade:true, onDelete:'CASCADE'})
    favoritos: FavoritosEntity[];
}