import { UsersService } from './users.service';
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {

    let service: AuthService;

    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // create a fake copy of users services
        const users: User[] = [];

        fakeUsersService = {
            find: (email: string) => {
                const filterdUsers = users.filter(user => user.email === email)
                return Promise.resolve(filterdUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            },
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

    it('throws an error if users signs up with email that is in use', async () => {
        await service
            .signup('max.mustermann@gmx.com', 'password123')
            .catch((err: BadRequestException) => {
                expect(err.message).toEqual('Email is using');
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

    it('throws if an invalid password is provided', async () => {
        await service.signup('aa@aa.com', 'password');
        try {
            await service.signin('aa@aa.com', 'password1');
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe('bad password');
        }
    });

    it('returns a user if correct password is provided', async () => {

        const userObj = await service.signup('a@test.com', '123456');

        const user = await service.signin('a@test.com', '123456');

        expect(user).toBeDefined();
        expect(user.email).toBe(userObj.email);
        expect(user.password).toBe(userObj.password);

    });
});
