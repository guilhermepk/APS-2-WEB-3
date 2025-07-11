import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    projectId: number;
}