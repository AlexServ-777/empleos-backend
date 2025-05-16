import { timestamp } from 'rxjs';
import { UsuarioEntity } from './usuarios.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FavoritosEntity } from './favoritos.entity';

@Entity()
export class PasantiaEntity {
    @PrimaryGeneratedColumn()
    id_pasantia: number;

    @Column({ nullable: false,length:50 })
    titulo: string;

    @Column({nullable:false,length:50})
    categoria:string;

    @Column({nullable:false})
    num_telf: number;

    @Column({ nullable: false,length:50 })
    ubicacion: string;

    @Column({nullable:false, length:50})
    ciudad: string;

    @Column({nullable:false})
    pais:string;

    @Column({nullable:true,length:1000})
    requisitos:string;

    @Column({ nullable: false,length:1000 })
    descripcion: string;

    @Column({ type:"enum",enum:['Presencial','Remoto','Hibrido'],nullable:false})
    modalidad: string;

    @Column({ nullable: false,length: 15})
    duracion: string;

    @CreateDateColumn()
    fecha_creacion: Date;

    @UpdateDateColumn()
    fecha_modificacion:Date;
    
    @Column({ nullable: false })
    fecha_inicio: Date;

    @Column({ nullable: false })
    fecha_fin: Date;

    @Column({ default: true, nullable: false })
    isActive: boolean;

    @ManyToOne(()=>UsuarioEntity,(user)=>user.pasantias,{onDelete:'CASCADE'})
    user?:UsuarioEntity;

    @OneToMany(() => FavoritosEntity, (favorito) => favorito.pasantia)
    favoritos: FavoritosEntity[];
}
