import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { logger } from '@/Zconsts/functions_nest';
import { set_report_dto } from '@/user/relations/reports/reports.dto';
import { ReportesEntity } from '@/user/relations/reports/reports.entity';
import { Repository } from 'typeorm';
import { EmpleosEntity } from '@/items/empleos/empleos.entity';
import { PasantiaEntity } from '@/items/pasantias/pasantias.entity';
import { ServiciosEntity } from '@/items/servicios/servicio.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(ReportesEntity)
        private readonly report_repo: Repository<ReportesEntity>,
        @InjectRepository(EmpleosEntity)
        private readonly empleo_repo: Repository<EmpleosEntity>,
        @InjectRepository(PasantiaEntity)
        private readonly pasantia_repo: Repository<PasantiaEntity>,
        @InjectRepository(ServiciosEntity)
        private readonly servicio_repo: Repository<ServiciosEntity>
    ) { }
    async set_report(data: any, req: any) {
        try {
            if(!data.id) throw new ConflictException('Data   is empty');
            const count_reports = await this.report_repo.count({ where: { type_id: data.id, type_report: data.type } }); //empeiza de 0
            if (count_reports >= 5) { //6 reportes, ya que comienza de 0 el conteo
                switch (data.type) {
                    case 'empleo': await this.empleo_repo.delete(data.id);
                        break;
                    case 'pasantia': await this.pasantia_repo.delete(data.id);
                        break;
                    case 'servicio': await this.servicio_repo.delete(data.id);
                        break;
                }
                logger.warn(data.type + " eliminado por varios reportes -> id" + data.id);
            } else {
                const create_report: set_report_dto = {
                    count_report: 1,
                    type_report: data.type,
                    type_id: data.id,
                    type_comentarie: data.message,
                    id_user: req.user.id,
                }
                await this.report_repo.save(create_report); //reporte creado
            }
            return { message: 'Se Reporto La Publicacion. Gracias por tu cooperacion' }
        }
        catch (error) {
            logger.error('FALLO Se reporte', error);
        }
    }
}
