import { UsersService } from './users.service';
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    // create a fake copy of users services

    let service: AuthService;

    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('Can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('jorney@gmail.com', 'test');

        expect(user.password).not.toEqual('test');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

    });

    it('throws an error if users signs up with email that is in use', (done) => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { id: 1, email: 'testperson@test.com', password: 'password123' } as User,
            ]);

        service
            .signup('max.mustermann@gmx.com', 'password123')
            .catch((err: BadRequestException) => {
                expect(err.message).toEqual('Email is using');
                done();
            });
    });

    it('throws if signin is called with an unused email', async () => {
        try {
            await service.signin('asdflkj@asdlfkj.com', 'passdflkj');
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
            expect(err.message).toBe('user not found');
        }
    });
});
