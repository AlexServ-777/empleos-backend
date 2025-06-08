import { Controller, Get, Inject, Param, Post, Req, Put,Delete, Body, UseGuards } from '@nestjs/common';
import { createServicioDTO, getServicioDTO, updateServicioDTO } from '../dtos/servicios.dto';
import { ServiciosSService } from '../services/servicios-s.service';
import { JwtGuardConf } from '../Zconfigs/jwt-guards';

@Controller('servicios-c')
export class ServiciosCController {
    constructor(@Inject(ServiciosSService)
    private readonly serviciosSService: ServiciosSService) {}
    
    //GETS
    @Get('getPublic')
    async get_Servicios_All_Controller():Promise<getServicioDTO[]> {
        return await this.serviciosSService.getServiciosAll();
    }
    @Get('getServicioOne/:id')
    async get_Servicio_Controller(@Param('id') id:string):Promise<getServicioDTO>{
        return await this.serviciosSService.getServicioOne(id);
    }
    @UseGuards(JwtGuardConf)
    @Get('getServiciosUsuario')
    async get_Servicios_Usuario_Controller(@Req() req:any):Promise<getServicioDTO[]>{
        return await this.serviciosSService.getServiciosUsuario(req);
    }

    //POSTS
    @UseGuards(JwtGuardConf)
    @Post('createServicio')
    async create_Servicios_Controller(@Body() data:createServicioDTO,@Req() req:any){
        return await this.serviciosSService.createServicio(data,req);
    }

    //PUTS
    @UseGuards(JwtGuardConf)
    @Put('updateServicio/:id')
    async update_Servicio_Controller(@Param('id') id:string,@Body() data:updateServicioDTO, @Req() req:any){
        return await this.serviciosSService.updateServicio(id,data,req);
    }

    //DELETES
    @UseGuards(JwtGuardConf)
    @Delete('deleteServicio/:id')
    async delete_Servicio_Controller(@Param('id') id:string, @Req() req:any){
        return await this.serviciosSService.deleteServicio(id,req);
    }
}

