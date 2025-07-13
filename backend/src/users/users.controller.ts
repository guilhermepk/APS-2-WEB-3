import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserEntity } from "./models/entities/user.entity";
import { CreateUserDto } from "./models/dtos/create-user.dto";
import { FindAllUsersResponseDto } from "./models/dtos/find-all-users-response.dto";

@Controller('users')
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) { }

    @Post()
    async create(
        @Body() body: CreateUserDto
    ) {
        return await this.service.create(body);
    }

    @Get()
    async findAll(): Promise<FindAllUsersResponseDto> {
        return await this.service.findAll();
    }
}