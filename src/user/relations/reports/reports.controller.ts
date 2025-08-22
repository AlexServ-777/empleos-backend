import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { ReportsService } from '@/user/relations/reports/reports.service';
import { JwtGuardConf } from '@/auth/auth_config/jwt-guards';

@Controller('reports')
export class ReportsController {
    constructor(
        private readonly report_service:ReportsService,
    ){}
    @SkipThrottle() //{long:true, medium:true, shot:false} //
    @UseGuards(JwtGuardConf)
    @Post('set-report')
    async set_report_c(@Body() body:any, @Req() req:Request){
        return await this.report_service.set_report(body, req);
    }
}
