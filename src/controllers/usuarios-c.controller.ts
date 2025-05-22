import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsusariosSService } from '../services/ususarios-s.service';
import { CreateUsuarioDto, loginUserDTO, UpdateUsuarioDto } from '../dtos/usuarios.dto';
import { JwtGuardConf } from 'src/Zconfigs/jwt-guards';
import { Throttle } from '@nestjs/throttler';

@Controller('usuarios-c')
export class UsuarioCController {
    constructor(private readonly appService: UsusariosSService) {}
    
      @UseGuards(JwtGuardConf)
      @Get('listar')
      getUsuarios(@Req() req:Request): Promise<any> {
        return this.appService.getUsuarios(req);
      }

      @UseGuards(JwtGuardConf)
      @Get('user')
      getUsuario(@Req() req:Request):Promise<any>{
        return this.appService.getUser(req);
      }

      @UseGuards(JwtGuardConf)
      @Get('pais')
      getPaisUser(@Req() req:Request):Promise<any>{
        return this.appService.getPaisUser(req);
      }

      @Throttle({default:{limit:10, ttl:3600000}})
      @Post('login')
      async login(@Body() user:loginUserDTO):Promise<any>{
        console.log(user);
        return await this.appService.loginUser(user);
      }

      @Throttle({default:{limit:10, ttl:3600000}})
      @Post('register') 
      async crearUsuario(@Body() usuario: CreateUsuarioDto): Promise<any> {
        return await this.appService.crearUsuario(usuario);
      }

      @UseGuards(JwtGuardConf)
      @Post('registerAdmin')
      async createUsuario(@Body() usuario: CreateUsuarioDto, @Req() req:Request):Promise<any>{
        return await this.appService.crearUsuarioAdmin(usuario,req);
      }

      @UseGuards(JwtGuardConf)
      @Delete('eliminar')
      async eliminarUsuario(@Req() req:Request): Promise<any> {
        return await this.appService.eliminarUsuario(req);
      }

      @UseGuards(JwtGuardConf)
      @Put('modificar')
      async actualizarUsuario(@Body() usuario: UpdateUsuarioDto, @Req() req:Request): Promise<any> {
        return await this.appService.actualizarUsuario(usuario, req);
      }

      @Throttle({default:{limit:5, ttl:3600000}})
      @UseGuards(JwtGuardConf)
      @Put('changePassword')
      async changePassController(@Req() req:Request, @Body() data){
        return await this.appService.changePassword(req,data);
      }

      //favoritos
      @UseGuards(JwtGuardConf)
      @Get('favoritos')
      async getFavoritos(@Req() req:Request):Promise<any>{
        return await this.appService.getFavoritos(req);
      }

      @UseGuards(JwtGuardConf)
      @Post('setFavorito')
      async setFavorito(@Req() req:Request, @Body() data){
        return await this.appService.setFavorito(req,data);
      }

      @UseGuards(JwtGuardConf)
      @Delete('deleteFavorito/:id')
      async eliminarFavorito(@Req() req:Request,@Param('id') id:number){
        return await this.appService.eliminarFavorito(req,id);
      }

      @UseGuards(JwtGuardConf)
      @Post('isFavorito')
      async isFavorito(@Req() req:Request, @Body() data){
        return await this.appService.isFavorito(req,data);
      }
}