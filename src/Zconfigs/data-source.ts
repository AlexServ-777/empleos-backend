import { DataSource } from "typeorm";
import { join } from "path";
import { UsuarioEntity } from "../user/usuarios.entity";
import { PasantiaEntity } from "../items/pasantias/pasantias.entity";
import { EmpleosEntity } from "../items/empleos/empleos.entity";
import { ServiciosEntity } from "../items/servicios/servicio.entity";
import { FavoritosEntity } from "../user/relations/favorites/favoritos.entity";
import { config } from "dotenv";
import { Forgot_Password_Entity } from "../auth/forgot-password.entity";
import { ReportesEntity } from "@/user/relations/reports/reports.entity";

config({path:'.develop.env'});
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [UsuarioEntity, PasantiaEntity,EmpleosEntity,ServiciosEntity,FavoritosEntity,Forgot_Password_Entity, ReportesEntity],
    synchronize: true,
    migrations: [join(__dirname,'/../migrations/*.ts')], //muy sensible, tratar de no tocar, mas que todo son los slash
    //bueno, descubri que cada vez que se quita el salsh no da problemas en las migraciones, pero si en iniciar el servidor
});