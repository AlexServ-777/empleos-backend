import { Body, Controller, Delete, Get,Param,Post,Put,Query,Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { limit_pagination } from 'src/Zconsts/vars_controllers';
import { createPasantiaDTO, infoPasantiaDTO, updatePasantiaDTO } from 'src/items/pasantias/pasantias.dto';
import { PasantiasSService } from 'src/items/pasantias/pasantias-s.service';
import { JwtGuardConf } from '@/auth/auth_config/jwt-guards';

@SkipThrottle()
@Controller('pasantias-c')
export class PasantiasCController {
    constructor(private readonly pasantiaService: PasantiasSService){
    }
    //GETS
    @Get('count-pasantias/:pais')
    async count_pasantias_pagination(@Param('pais') pais:string, @Query('search') search:string){
        return await this.pasantiaService.total_rows(pais, search);
    }
    //obtener las pasantias segun busqueda exacta (con paginacion)
    @Get('search/:pais')
    async search_pasantia_c(@Param('pais') pais:string, @Query('search') search:string, @Query('page') page:number, @Query('limit') limit:number){
        return await this.pasantiaService.search_pasantias(search,pais,page,limit);
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
