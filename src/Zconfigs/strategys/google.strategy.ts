import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(googleOauthConfig.KEY) private googleConfig:
  ConfigType<typeof googleOauthConfig>,
  private auth_service:AuthService) {
    super({
      clientID: googleConfig.clientID!,
      clientSecret: googleConfig.clientSecret!,
      callbackURL: googleConfig.callbackURL!,
      scope: ['email', 'profile'],
      passReqToCallback:true,
    });
  }

  async validate(
    req:Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback, 
  ) {
    const country = req.cookies['country'];
    const user = await this.auth_service.validateGoogleUser({
      email:profile.emails[0].value,
      nombre:profile.name.givenName,
      apellido:profile.name.familyName??'none',
      password:"",
      pais:country,
      rol:"usuario",
      nom_usuario:"none"
    })
    done(null,user);
  }
}
