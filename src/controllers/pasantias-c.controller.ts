import { Body, Controller, Delete, Get,Param,Post,Put,Req, UseGuards } from '@nestjs/common';
import { createPasantiaDTO, infoPasantiaDTO, updatePasantiaDTO } from 'src/dtos/pasantias.dto';
import { PasantiasSService } from 'src/services/pasantias-s.service';
import { JwtGuardConf } from 'src/Zconfigs/jwt-guards';

@Controller('pasantias-c')
export class PasantiasCController {
    constructor(private readonly pasantiaService: PasantiasSService){
    }
    //GETS
    @Get('getPublic/:pais')
    async getPasantiasController(@Param('pais') pais:string):Promise<infoPasantiaDTO[]>{
        return this.pasantiaService.getPasantias(pais);
    }

    @UseGuards(JwtGuardConf)
    @Get('getPasantiasUser')
    async getPasntiasUserController(@Req() req:Request):Promise<infoPasantiaDTO[]>{
        return this.pasantiaService.getPasantiasUser(req);
    }

    @Get('getPasantia/:id')
    async getPasantiaController(@Param('id') id:string):Promise<infoPasantiaDTO>{
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
    async updatePasantiaController(@Body() Body:updatePasantiaDTO,@Param('id') id:number, @Req() req: Request ){
        return await this.pasantiaService.updatePasantia(Body,id, req);
    }
    //DELETES
    @UseGuards(JwtGuardConf)
    @Delete('deletePasantia/:id')
    async deletePasantiaController(@Req() req:Request, @Param('id') id:number){
        return await this.pasantiaService.deletePasantia(req,id);
    }

    @UseGuards(JwtGuardConf)
    @Put('renovation/:id')
    async renovation(@Param('id') id:string){
        return await this.pasantiaService.renovarPasantia(Number(id));
    }
}
