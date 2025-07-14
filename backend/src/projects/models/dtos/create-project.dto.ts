import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty({ message: `'name' não pode estar vazio` })
    @IsString({ message: `'name' deve ser uma string` })
    @MaxLength(100, { message: `'name' deve ter no máximo 100 caracteres` })
    name: string;

    @IsOptional()
    @IsString({ message: `'description' deve ser uma string` })
    description?: string;

    @IsOptional()
    @IsArray()
    @IsNumber(undefined, { each: true })
    userIds?: number[];
}