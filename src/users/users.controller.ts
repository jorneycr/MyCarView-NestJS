import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Session,
    UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @Get('/whoami')
    whoAmI(@Session() session: any) {
        return this.usersService.findOne(session.userId);
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() createUserDto: CreateUserDto, @Session() session: any) {
        const { email, password } = createUserDto;
        const user = await this.authService.signup(email, password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() createUserDto: CreateUserDto, @Session() session: any) {
        const { email, password } = createUserDto;
        const user = await this.authService.signin(email, password);
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(parseInt(id), updateUserDto);
    }
}
