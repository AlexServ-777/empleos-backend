import { DataSource } from "typeorm";
import { dirname, join } from "path";
import { UsuarioEntity } from "../entidades/usuarios.entity";
import { PasantiaEntity } from "../entidades/pasantias.entity";
import { EmpleosEntity } from "../entidades/empleos.entity";
import { ServiciosEntity } from "../entidades/servicio.entity";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',  
    password: 'root',
    database: 'empleosDB',
    entities: [UsuarioEntity, PasantiaEntity,EmpleosEntity,ServiciosEntity],
    synchronize: true,
    migrations: [join(__dirname,'/../migrations/*.ts')], //muy sensible, tratar de no tocar, mas que todo son los slash
    //bueno, descubri que cada vez que se quita el salsh no da problemas en las migraciones, pero si en iniciar el servidor
});