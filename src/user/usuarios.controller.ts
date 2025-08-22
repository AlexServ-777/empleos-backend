import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UsusariosSService } from './usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuarios.dto';
import { JwtGuardConf } from '../auth/auth_config/jwt-guards';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response} from 'express';


@Controller('usuarios-c')
export class UsuarioCController {
    constructor(private readonly appService: UsusariosSService) {}

    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Get('listar')
    getUsuarios(@Req() req:Request): Promise<any> {
      return this.appService.getUsuarios(req);
    }

    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Get('user')
    getUsuario(@Req() req:Request):Promise<any>{
      return this.appService.getUser(req);
    }

    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Get('pais')
    getPaisUser(@Req() req:Request):Promise<any>{
      return this.appService.getPaisUser(req);
    }

    
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
    async eliminarUsuario(@Req() req:Request, @Res({passthrough:true}) res:Response): Promise<any> {
      const userDeleted= await this.appService.eliminarUsuario(req);
      res.clearCookie('tokenJWT',{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        path:'/',
        maxAge:30*24*60*60*1000
      });
      return userDeleted;
    }

    @UseGuards(JwtGuardConf)
    @Put('modificar')
    async actualizarUsuario(@Body() usuario: UpdateUsuarioDto, @Req() req:Request): Promise<any> {
      return await this.appService.actualizarUsuario(usuario, req);
    }

    @UseGuards(JwtGuardConf)
    @Put('changePassword')
    async changePassController(@Req() req:Request, @Body() data){
      return await this.appService.changePassword(req,data);
    }

    //favoritos
    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Get('favoritos')
    async getFavoritos(@Req() req:Request):Promise<any>{
      return await this.appService.getFavoritos(req);
    }

    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Post('setFavorito')
    async setFavorito(@Req() req:Request, @Body() data){
      return await this.appService.setFavorito(req,data);
    }

    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Delete('deleteFavorito/:id')
    async eliminarFavorito(@Req() req:Request, @Param('id') id){
      return await this.appService.eliminarFavorito(req,Number(id));
    }

    @SkipThrottle()
    @UseGuards(JwtGuardConf)
    @Post('isFavorito')
    async isFavorito(@Req() req:Request, @Body() data:any){
      return await this.appService.isFavorito(req,data);
    }
}