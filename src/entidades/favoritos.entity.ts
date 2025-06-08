import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuarios.entity";
import { EmpleosEntity } from "./empleos.entity";
import { ServiciosEntity } from "./servicio.entity";
import { PasantiaEntity } from "./pasantias.entity";

export enum TipoFavorito {
    EMPLEO = 'empleo',
    SERVICIO = 'servicio',
    PASANTIA = 'pasantia'
}

@Entity('favoritos')
export class FavoritosEntity {
    @PrimaryGeneratedColumn()
    id_favorito: number;

    @Column({
        type: 'enum',
        enum: TipoFavorito,
        nullable: false
    })
    tipo_favorito: TipoFavorito;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.favoritos, {onDelete:'CASCADE'})
    usuario: UsuarioEntity;

    @ManyToOne(() => EmpleosEntity, { nullable: true, onDelete:'CASCADE'})
    empleo?: EmpleosEntity;

    @ManyToOne(() => ServiciosEntity, { nullable: true, onDelete:'CASCADE'})
    servicio?: ServiciosEntity;

    @ManyToOne(() => PasantiaEntity, { nullable: true, onDelete:'CASCADE'})
    pasantia?: PasantiaEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
}