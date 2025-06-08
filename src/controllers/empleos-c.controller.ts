import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { EmpleosSService } from '../services/empleos-s.service';
import { JwtGuardConf } from '../Zconfigs/jwt-guards';
import { createEmpleoDTO, getEmpleoDTO, updateEmpleoDTO } from '../dtos/empleos.dto';

@Controller('empleos-c')
export class EmpleosCController {
    constructor(private readonly appService:EmpleosSService){}

    @Get('getPublic')
    async getEmpleos():Promise<getEmpleoDTO[]>{ //sin token, publico
        return await this.appService.getEmpleos();
    }

    @UseGuards(JwtGuardConf)
    @Get('empleos-user') //con token
    async getEmpleosUserController(@Req() req:Request):Promise<getEmpleoDTO[]>{
        return await this.appService.getEmpleosUser(req);       
    }
    @Get('infoEmpleo/:id')
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
}