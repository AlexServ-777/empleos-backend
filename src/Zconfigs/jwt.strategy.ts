import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
@Injectable()
//esto verifica el token que se envia desde el frontend
export class HttpStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req:Request)=>{
                    const data = req?.cookies['token'];
                    if(!data) return null;
                    return data;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}