import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//esto llama al al tipo de  Guardian que seria JWT en este caso
@Injectable()
export class JwtGuardConf extends AuthGuard('jwt'){
}