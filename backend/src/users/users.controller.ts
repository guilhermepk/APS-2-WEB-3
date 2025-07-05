import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserEntity } from "./models/entities/user.entity";

@Controller('users')
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) { }

    @Get()
    async findAll(): Promise<Array<UserEntity>> {
        return await this.service.findAll();
    }
}