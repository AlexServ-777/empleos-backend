import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1746491580559 implements MigrationInterface {
    name = 'Generated1746491580559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`empleos_entity\` (\`id_empleo\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(50) NOT NULL, \`categoria\` varchar(50) NOT NULL, \`salario\` int NULL, \`num_telf\` int NOT NULL, \`modalidad\` enum ('presencial', 'remoto', 'hibrido') NOT NULL, \`ciudad\` varchar(50) NOT NULL, \`ubicacion\` varchar(50) NOT NULL, \`pais\` varchar(300) NOT NULL, \`requisitos\` varchar(1000) NOT NULL, \`descripcion\` varchar(1000) NOT NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_modificacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, \`userIdUsuario\` int NULL, PRIMARY KEY (\`id_empleo\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pasantia_entity\` (\`id_pasantia\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(50) NOT NULL, \`categoria\` varchar(50) NOT NULL, \`num_telf\` int NOT NULL, \`ubicacion\` varchar(50) NOT NULL, \`ciudad\` varchar(50) NOT NULL, \`pais\` varchar(255) NOT NULL, \`requisitos\` varchar(1000) NULL, \`descripcion\` varchar(1000) NOT NULL, \`modalidad\` enum ('presencial', 'remoto', 'hibrido') NOT NULL, \`duracion\` varchar(15) NOT NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_modificacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`fecha_inicio\` datetime NOT NULL, \`fecha_fin\` datetime NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`userIdUsuario\` int NULL, PRIMARY KEY (\`id_pasantia\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`servicios_entity\` (\`id_servicio\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(50) NOT NULL, \`categoria\` varchar(50) NOT NULL, \`num_telf\` int NOT NULL, \`precio\` int NOT NULL, \`modalidad\` enum ('presencial', 'remoto', 'hibrido') NOT NULL, \`descripcion\` varchar(1000) NOT NULL, \`ubicacion\` varchar(50) NOT NULL, \`ciudad\` varchar(50) NOT NULL, \`pais\` varchar(50) NOT NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_modificacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`active\` tinyint NOT NULL DEFAULT 1, \`userIdUsuario\` int NULL, PRIMARY KEY (\`id_servicio\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario_entity\` (\`id_usuario\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(50) NOT NULL, \`apellido\` varchar(50) NOT NULL, \`nom_usuario\` varchar(50) NOT NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(100) NOT NULL, \`rol\` enum ('admin', 'empresa', 'usuario') NOT NULL DEFAULT 'usuario', \`pais\` varchar(30) NOT NULL, \`fecha_registro\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_63743889a693b37903f4826e37\` (\`nom_usuario\`), UNIQUE INDEX \`IDX_6082ea37fc8d89e467f2674e74\` (\`email\`), PRIMARY KEY (\`id_usuario\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`empleos_entity\` ADD CONSTRAINT \`FK_74c6df437a299192ab7c9e375f4\` FOREIGN KEY (\`userIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pasantia_entity\` ADD CONSTRAINT \`FK_137ee37e5185065b2df625943a7\` FOREIGN KEY (\`userIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`servicios_entity\` ADD CONSTRAINT \`FK_953183c13031ba692d210b17bd6\` FOREIGN KEY (\`userIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`servicios_entity\` DROP FOREIGN KEY \`FK_953183c13031ba692d210b17bd6\``);
        await queryRunner.query(`ALTER TABLE \`pasantia_entity\` DROP FOREIGN KEY \`FK_137ee37e5185065b2df625943a7\``);
        await queryRunner.query(`ALTER TABLE \`empleos_entity\` DROP FOREIGN KEY \`FK_74c6df437a299192ab7c9e375f4\``);
        await queryRunner.query(`DROP INDEX \`IDX_6082ea37fc8d89e467f2674e74\` ON \`usuario_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_63743889a693b37903f4826e37\` ON \`usuario_entity\``);
        await queryRunner.query(`DROP TABLE \`usuario_entity\``);
        await queryRunner.query(`DROP TABLE \`servicios_entity\``);
        await queryRunner.query(`DROP TABLE \`pasantia_entity\``);
        await queryRunner.query(`DROP TABLE \`empleos_entity\``);
    }

}
