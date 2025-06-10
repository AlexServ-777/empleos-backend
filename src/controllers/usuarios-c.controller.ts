import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { UsusariosSService } from '../services/ususarios-s.service';
import { CreateUsuarioDto, loginUserDTO, UpdateUsuarioDto } from '../dtos/usuarios.dto';
import { JwtGuardConf } from 'src/Zconfigs/jwt-guards';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Controller('usuarios-c')
export class UsuarioCController {
    constructor(private readonly appService: UsusariosSService) {}

    @Get('csrf-token')
    getCsrfToken(@Req() req: Request) {
        return {
            token: req.csrfToken()
        };
    }

    @Get('verificar-token')
    verificarToken(@Req() req:Request){
      return this.appService.verificarToken(req);
    }

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
    @Post('login') //1 hora
    @UsePipes()
    async login(@Body() user:loginUserDTO, @Res({passthrough:true}) res:Response):Promise<any>{
      const token = await this.appService.loginUser(user);
      res.cookie('token',token,{
        httpOnly:true,
        maxAge:30*24*60*60*1000, //30 dias
        sameSite:'none',
        path:'/',
        secure:true,
      })
      return {message:"login exitoso"}
    }

    @UseGuards(JwtGuardConf)
    @Post('logout')
    async logout(@Res({passthrough:true}) res:Response){
      res.clearCookie('token',{
        httpOnly:true,
        maxAge:0,
        sameSite:'none',
        path:'/',
        secure:true,
      });
      return {message:"logout exitoso"}
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
    async eliminarFavorito(@Req() req:Request, @Param('id') id){
      return await this.appService.eliminarFavorito(req,Number(id));
    }

    @UseGuards(JwtGuardConf)
    @Post('isFavorito')
    async isFavorito(@Req() req:Request, @Body() data:any){
      return await this.appService.isFavorito(req,data);
    }
}