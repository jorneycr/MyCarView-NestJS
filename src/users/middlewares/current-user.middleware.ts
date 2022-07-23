import { Repository } from 'typeorm';
import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { User } from "../user.entity";
import { UsersService } from "../users.service";
import { InjectRepository } from '@nestjs/typeorm';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

export class CurrentUserMiddlewares implements NestMiddleware {
    constructor(
        private usersService: UsersService,
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if (userId) {
            if (!userId) {
                return null;
            }
            const id = userId;
            const user = await this.repo.findOneBy({ id });
            req.currentUser = user;
        }

        next();
    }

}