import { AdminGuard } from '../guards/admin.guard';
import { ReportDto } from './dtos/report.dto';
import { User } from '../users/user.entity';
import { ReportsService } from './reports.service';
import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrrentUser } from '../users/decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() createReportDto: CreateReportDto, @CurrrentUser() user: User) {
        this.reportsService.create(createReportDto, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approvedReport(@Param('id') id: number, @Body() approveReportDto: ApproveReportDto) {
        return this.reportsService.changeApproval(id, approveReportDto.approved);
    }
}
