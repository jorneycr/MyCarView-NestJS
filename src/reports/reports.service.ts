import { GetEstimateDto } from './dtos/get-estimate.dto';
import { User } from '../users/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ) { }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }

    async changeApproval(id: number, approved: boolean) {
        const report = await this.repo.findOneBy({ id })
        if (!report) throw new NotFoundException('report not found');

        report.approved = approved;
        return this.repo.save(report);
    }

    createEstimate({ make, model, year, mileage }: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('*')
            .where('make= :make', { make })
            .andWhere('model= :model', { model })
            .andWhere('year= :year BETWEEN -3 AND 3', { year })
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(2)
            .getRawMany();
    }
}
