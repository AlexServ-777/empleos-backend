import { Body, Controller, Delete, Get,Param,Post,Put,Req, UseGuards } from '@nestjs/common';
import { createPasantiaDTO } from 'src/dtos/pasantias.dto';
import { PasantiasSService } from 'src/services/pasantias-s.service';
import { JwtGuardConf } from 'src/Zconfigs/jwt-guards';
import { Repository } from 'typeorm';

@Controller('pasantias-c')
export class PasantiasCController {
    constructor(private readonly pasantiaService: PasantiasSService){
    }
    //GETS
    @Get('getPasantiasPublic')
    async getPasantiasController(){
        return this.pasantiaService.getPasantias();
    }

    @UseGuards(JwtGuardConf)
    @Get('getPasantiasUser')
    async getPasntiasUserController(@Req() req:Request){
        return this.pasantiaService.getPasantiasUser(req);
    }

    @Get('getPasantia/:id')
    async getPasantiaController(@Param('id') id:string){
        return this.pasantiaService.getPasantiaService(Number(id));
    }

    //POSTS
    @UseGuards(JwtGuardConf)
    @Post('newPasantia')
    async newPasantiaController(@Req() req:Request, @Body() Body:createPasantiaDTO):Promise<any>{
        console.log("body?"+Body);
        return await this.pasantiaService.createPasantia(Body,req);
    }
    //PUTS
    @UseGuards(JwtGuardConf)
    @Put('updatePasantia/:id')
    async updatePasantiaController(@Body() Body,@Param('id') id, @Req() req: Request ){
        return this.pasantiaService.updatePasantia(Body,id, req);
    }
    //DELETES
    @UseGuards(JwtGuardConf)
    @Delete('deletePasantia/:id')
    async deletePasantiaController(@Req() req:Request, @Param('id') id){
        return this.pasantiaService.deletePasantia(req,id);
    }

}
