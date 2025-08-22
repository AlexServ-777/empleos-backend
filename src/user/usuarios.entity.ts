import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { EmpleosEntity } from '../items/empleos/empleos.entity';
import { PasantiaEntity } from '../items/pasantias/pasantias.entity';
import { ServiciosEntity } from '../items/servicios/servicio.entity';
import { FavoritosEntity } from './relations/favorites/favoritos.entity';
@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column({length: 50, nullable: false})
    nombre: string;

    @Column({length:50,nullable:false})
    apellido:string

    @Column({length:50,nullable:false,unique:true})
    nom_usuario:string;

    @Column({length: 75, nullable: false,unique:true})
    email: string;

    @Column({length: 100, nullable: false})
    password: string;

    @Column({nullable: false,type:'simple-enum', enum:["usuario","admin","empresa"], default:'usuario'})
    rol: string; //admin, empresa, usuario

    @Column({length:30, nullable:false})
    pais:string;

    @CreateDateColumn()
    fecha_registro: Date;

    @Column({ default: true })
    isActive: boolean;


    //relaciones
    @OneToMany(()=>EmpleosEntity,(empleos)=>empleos.user,{cascade:true, onDelete:'CASCADE'})
    empleos:EmpleosEntity[];

    @OneToMany(()=>PasantiaEntity,(pasantia)=>pasantia.user,{cascade:true, onDelete:'CASCADE'})
    pasantias:PasantiaEntity[];

    @OneToMany(()=>ServiciosEntity,(servicio)=>servicio.user, {cascade:true,onDelete:"CASCADE"})
    servicios:ServiciosEntity[];

    //favoritos
    @OneToMany(() => FavoritosEntity, (favorito) => favorito.usuario, {cascade:true, onDelete:"CASCADE"})
    favoritos: FavoritosEntity[];
}