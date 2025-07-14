import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { IsID } from "src/common/custom-validators/is-id.validator";

export class CreateProjectDto {
    @IsNotEmpty({ message: `'name' não pode estar vazio` })
    @IsString({ message: `'name' deve ser uma string` })
    @MaxLength(100, { message: `'name' deve ter no máximo 100 caracteres` })
    name: string;

    @IsOptional()
    @IsString({ message: `'description' deve ser uma string` })
    description?: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsID()
    userIds: number[];
}