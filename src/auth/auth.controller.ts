import { Body, Controller, Get,Param,Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { SkipThrottle, Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { loginUserDTO } from '../dtos/usuarios.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from '../Zconfigs/google-auth/google-auth.guard';
import { Request, Response } from 'express';
import { JwtGuardConf } from '../Zconfigs/jwt-guards';

@Controller('auth')
export class AuthController {
    constructor(
        private auth_service: AuthService
    ) { }

    @SkipThrottle() //no tiene limites de llamadas
    @Get('csrf-token')
    getCsrfToken(@Req() req: Request) {
        return {
            token: req.csrfToken()
        };
    }
    @SkipThrottle() //no tiene limites de llamadas
    @Get('verificar-token')
    verificarToken(@Req() req: Request) {
        return this.auth_service.verificarToken(req);
    }
    //SignIn y SignOut

    @Post('login') //1 hora
    @UsePipes()
    async login(@Body() user: loginUserDTO, @Res({ passthrough: true }) res: Response): Promise<any> {
        const token = await this.auth_service.loginUser(user);
        res.cookie('tokenJWT', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 dias
            sameSite: 'none',
            path: '/',
            secure: true,
        })
        return { message: "login exitoso" }
    }

    @UseGuards(JwtGuardConf)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('tokenJWT', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'none',
            path: '/',
            secure: true,
        });
        return { message: "logout exitoso" }
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    googleLogin() {

    }
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Req() req:any, @Res() res: Response) {
        const email = req.user.email;
        const token = await this.auth_service.loginUserGoogle(email);
        res.cookie('tokenJWT', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 dias
        });
        return res.redirect(process.env.url_front!)
    }

    @Get('forgotPassword/:email')
    async forgotPassword_controller(@Param('email') email:string){
        return await this.auth_service.forgotPassword_send_email(email);
    }
}
