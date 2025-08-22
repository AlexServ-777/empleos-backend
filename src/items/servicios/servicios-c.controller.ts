import { Controller, Get, Inject, Param, Post, Req, Put,Delete, Body, UseGuards, Query } from '@nestjs/common';
import { createServicioDTO, getServicioDTO, updateServicioDTO } from './servicios.dto';
import { ServiciosSService } from './servicios-s.service';
import { JwtGuardConf } from '../../auth/auth_config/jwt-guards';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('servicios-c')
export class ServiciosCController {
    constructor(@Inject(ServiciosSService)
    private readonly serviciosSService: ServiciosSService) {}
    
    //GETS
    @Get('count-servicios/:pais')
    async count_servicios_total(@Param('pais') pais:string, @Query('search') search:string){
        return await this.serviciosSService.count_total_rows(pais,search);
    }
    //search
    @Get('search/:pais')
    async search_servicios(@Param('pais') pais:string, @Query('search') search:string ,@Query('page') page: number, @Query('limit') limit:number ){
        return await this.serviciosSService.search_servicios(pais, search, page, limit);
    } 
    
    @Get('getServicio/:id')
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

    @UseGuards(JwtGuardConf)
    @Put('renovation/:id')
    async renovation(@Param('id') id:string){
        return await this.serviciosSService.renovarServicio(Number(id));
    }
}

