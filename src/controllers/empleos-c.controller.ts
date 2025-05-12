import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { EmpleosSService } from '../services/empleos-s.service';
import { JwtGuardConf } from '../Zconfigs/jwt-guards';
import { createEmpleoDTO } from 'src/dtos/empleos.dto';

@Controller('empleos-c')
export class EmpleosCController {
    constructor(private readonly appService:EmpleosSService){}

    @Get('listar')
    async getEmpleos():Promise<any>{ //sin token, publico
        return await this.appService.getEmpleos();
    }

    @UseGuards(JwtGuardConf)
    @Get('empleos-user') //con token
    async getEmpleosUserController(@Req() req:Request){
        return await this.appService.getEmpleosUser(req);       
    }

    @Get('infoEmpleo/:id')
    async getInfoEmpleo(@Param('id') id:string){
        return await this.appService.getEmpleoInformacion(Number(id));
    }

    @UseGuards(JwtGuardConf)
    @Post('crear-empleo') //con token
    async crear(@Body() body:createEmpleoDTO, @Req() req:Request):Promise<any>{
        return this.appService.createEmpleo(body, req);
    }

    @UseGuards(JwtGuardConf)
    @Put('update-empleo/:id') //con parametro de url
    async updateEmpCon(@Body() data,@Req() req:Request,@Param('id') id:string){
        return await this.appService.updateEmpleoService(data,req,Number(id));
    }


    @UseGuards(JwtGuardConf)
    @Delete('delete-empleo/:id') //con parametro de url
    async deleteEmpleo(@Req() req:Request, @Param('id') id:string){
        return await this.appService.deleteEmpleoService(req,Number(id));
    }
}