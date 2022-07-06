import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Post('/signup')
    createUser(@Body() createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;
        this.usersService.create(email, password);
    }
}
