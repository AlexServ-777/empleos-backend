import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1749758555913 implements MigrationInterface {
    name = 'Generated1749758555913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`servicios_entity\` (\`id_servicio\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(50) NOT NULL, \`categoria\` varchar(50) NOT NULL, \`num_telf\` varchar(255) NOT NULL, \`precio\` varchar(255) NOT NULL, \`modalidad\` enum ('Presencial', 'Remoto', 'Hibrido') NOT NULL, \`descripcion\` varchar(1000) NOT NULL, \`ubicacion\` varchar(50) NOT NULL, \`ciudad\` varchar(50) NOT NULL, \`pais\` varchar(50) NOT NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_modificacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, \`userIdUsuario\` int NULL, PRIMARY KEY (\`id_servicio\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pasantia_entity\` (\`id_pasantia\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(50) NOT NULL, \`categoria\` varchar(50) NOT NULL, \`num_telf\` varchar(30) NOT NULL, \`ubicacion\` varchar(50) NOT NULL, \`ciudad\` varchar(50) NOT NULL, \`pais\` varchar(255) NOT NULL, \`requisitos\` varchar(1000) NULL, \`descripcion\` varchar(1000) NOT NULL, \`modalidad\` enum ('Presencial', 'Remoto', 'Hibrido') NOT NULL, \`duracion\` varchar(15) NOT NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_modificacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`fecha_inicio\` datetime NOT NULL, \`fecha_fin\` datetime NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`userIdUsuario\` int NULL, PRIMARY KEY (\`id_pasantia\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`favoritos\` (\`id_favorito\` int NOT NULL AUTO_INCREMENT, \`tipo_favorito\` enum ('empleo', 'servicio', 'pasantia') NOT NULL, \`fecha_creacion\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`usuarioIdUsuario\` int NULL, \`empleoIdEmpleo\` int NULL, \`servicioIdServicio\` int NULL, \`pasantiaIdPasantia\` int NULL, PRIMARY KEY (\`id_favorito\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`empleos_entity\` (\`id_empleo\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(50) NOT NULL, \`categoria\` varchar(50) NOT NULL, \`salario\` bigint NULL, \`num_telf\` varchar(30) NOT NULL, \`modalidad\` enum ('Presencial', 'Remoto', 'Hibrido') NOT NULL, \`ciudad\` varchar(50) NOT NULL, \`ubicacion\` varchar(50) NOT NULL, \`pais\` varchar(300) NOT NULL, \`requisitos\` varchar(1000) NOT NULL, \`descripcion\` varchar(1000) NOT NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_modificacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, \`userIdUsuario\` int NULL, PRIMARY KEY (\`id_empleo\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario_entity\` (\`id_usuario\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(50) NOT NULL, \`apellido\` varchar(50) NOT NULL, \`nom_usuario\` varchar(50) NOT NULL, \`email\` varchar(75) NOT NULL, \`password\` varchar(100) NOT NULL, \`rol\` enum ('usuario', 'admin', 'empresa') NOT NULL DEFAULT 'usuario', \`pais\` varchar(30) NOT NULL, \`fecha_registro\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_63743889a693b37903f4826e37\` (\`nom_usuario\`), UNIQUE INDEX \`IDX_6082ea37fc8d89e467f2674e74\` (\`email\`), PRIMARY KEY (\`id_usuario\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`servicios_entity\` ADD CONSTRAINT \`FK_953183c13031ba692d210b17bd6\` FOREIGN KEY (\`userIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pasantia_entity\` ADD CONSTRAINT \`FK_137ee37e5185065b2df625943a7\` FOREIGN KEY (\`userIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favoritos\` ADD CONSTRAINT \`FK_a64152172f5e625e0764c407d57\` FOREIGN KEY (\`usuarioIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favoritos\` ADD CONSTRAINT \`FK_7ec22127707757e847733606a3c\` FOREIGN KEY (\`empleoIdEmpleo\`) REFERENCES \`empleos_entity\`(\`id_empleo\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favoritos\` ADD CONSTRAINT \`FK_75d06c3345c36539d0ff351d57b\` FOREIGN KEY (\`servicioIdServicio\`) REFERENCES \`servicios_entity\`(\`id_servicio\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favoritos\` ADD CONSTRAINT \`FK_0029843dd8cafa6bc77e62da958\` FOREIGN KEY (\`pasantiaIdPasantia\`) REFERENCES \`pasantia_entity\`(\`id_pasantia\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`empleos_entity\` ADD CONSTRAINT \`FK_74c6df437a299192ab7c9e375f4\` FOREIGN KEY (\`userIdUsuario\`) REFERENCES \`usuario_entity\`(\`id_usuario\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`empleos_entity\` DROP FOREIGN KEY \`FK_74c6df437a299192ab7c9e375f4\``);
        await queryRunner.query(`ALTER TABLE \`favoritos\` DROP FOREIGN KEY \`FK_0029843dd8cafa6bc77e62da958\``);
        await queryRunner.query(`ALTER TABLE \`favoritos\` DROP FOREIGN KEY \`FK_75d06c3345c36539d0ff351d57b\``);
        await queryRunner.query(`ALTER TABLE \`favoritos\` DROP FOREIGN KEY \`FK_7ec22127707757e847733606a3c\``);
        await queryRunner.query(`ALTER TABLE \`favoritos\` DROP FOREIGN KEY \`FK_a64152172f5e625e0764c407d57\``);
        await queryRunner.query(`ALTER TABLE \`pasantia_entity\` DROP FOREIGN KEY \`FK_137ee37e5185065b2df625943a7\``);
        await queryRunner.query(`ALTER TABLE \`servicios_entity\` DROP FOREIGN KEY \`FK_953183c13031ba692d210b17bd6\``);
        await queryRunner.query(`DROP INDEX \`IDX_6082ea37fc8d89e467f2674e74\` ON \`usuario_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_63743889a693b37903f4826e37\` ON \`usuario_entity\``);
        await queryRunner.query(`DROP TABLE \`usuario_entity\``);
        await queryRunner.query(`DROP TABLE \`empleos_entity\``);
        await queryRunner.query(`DROP TABLE \`favoritos\``);
        await queryRunner.query(`DROP TABLE \`pasantia_entity\``);
        await queryRunner.query(`DROP TABLE \`servicios_entity\``);
    }

}
