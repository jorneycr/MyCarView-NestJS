import { UsersService } from './users.service';
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"

it('Can create an instance of auth service', async () => {
    // create a fake copy of users services

    const fakeUsersServices = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
    }

    const module = await Test.createTestingModule({
        providers: [
            AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersServices
            }
        ]
    }).compile();

    const service = module.get(AuthService);

    expect(service).toBeDefined();
})