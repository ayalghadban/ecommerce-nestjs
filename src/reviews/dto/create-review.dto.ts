import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty({message: 'Product should not e empty'})
    @IsNumber({},{message:'Product Id should be number'})
    productId: number;

    @IsNotEmpty({message: 'ratings should not e empty'})
    @IsNumber({},{message:'ratings should be number'})
    ratings:number;
    
    @IsNotEmpty({message: 'comment should not e empty'})
    @IsString({message:'comment should be string'})
    comment:string;
}
