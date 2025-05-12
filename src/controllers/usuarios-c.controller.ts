import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsusariosSService } from '../services/ususarios-s.service';
import { CreateUsuarioDto, loginUserDTO, UpdateUsuarioDto } from '../dtos/usuarios.dto';
import { JwtGuardConf } from 'src/Zconfigs/jwt-guards';
import { identity } from 'rxjs';

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

      @Post('login')
      async login(@Body() user:loginUserDTO):Promise<any>{
        console.log(user);
        return await this.appService.loginUser(user);
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
      async eliminarUsuario(@Req() req:Request): Promise<any> {
        return await this.appService.eliminarUsuario(req);
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
}