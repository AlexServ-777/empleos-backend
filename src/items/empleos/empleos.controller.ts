import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EmpleosSService } from './empleos.service';
import { JwtGuardConf } from '../../auth/auth_config/jwt-guards';
import { createEmpleoDTO, getEmpleoDTO, updateEmpleoDTO } from './empleos.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { limit_pagination } from '../../Zconsts/vars_controllers';

@SkipThrottle()
@Controller('empleos-c')
export class EmpleosCController {
    constructor(private readonly appService:EmpleosSService){}

    @Get('count-empleos/:pais')
    async count_empleos_pagination(@Param('pais') pais:string, @Query('search') search:string){
        return await this.appService.get_total_empleo(pais, search);
    }

    // busqueda segun input search
    @Get('search/:pais')
    async get_empleo_search(@Param('pais') pais:string, @Query('search') content:string, @Query('page') page:number, @Query('limit') limit:number){
        return await this.appService.search_empleos(pais,content, page,limit);
    }

    @UseGuards(JwtGuardConf)
    @Get('empleos-user') //con token
    async getEmpleosUserController(@Req() req:Request):Promise<getEmpleoDTO[]>{
        return await this.appService.getEmpleosUser(req);       
    }

    @Get('getEmpleo/:id')
    async getInfoEmpleo(@Param('id') id:string):Promise<getEmpleoDTO>{
        return await this.appService.getEmpleoInformacion(Number(id));
    }


    @UseGuards(JwtGuardConf)
    @Post('crear-empleo') //con token
    async crear(@Body() body:createEmpleoDTO, @Req() req:Request){
        return this.appService.createEmpleo(body, req);
    }


    
    @UseGuards(JwtGuardConf)
    @Put('update-empleo/:id') //con parametro de url
    async updateEmpCon(@Body() data:updateEmpleoDTO,@Req() req:Request,@Param('id') id:string){
        return await this.appService.updateEmpleoService(data,req,Number(id));
    }


    @UseGuards(JwtGuardConf)
    @Delete('delete-empleo/:id') //con parametro de url
    async deleteEmpleo(@Req() req:Request, @Param('id') id:string){
        return await this.appService.deleteEmpleoService(req,Number(id));
    }

    @UseGuards(JwtGuardConf)
    @Put('renovation/:id')
    async renovar(@Param('id') id:string){
        return await this.appService.renovarEmpleo(Number(id));
    }
}