import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class PurchaseItemDto {
  @ApiProperty({ description: "ID de l’item à acheter" })
  @IsInt()
  itemId: number;

  @ApiProperty({ description: "Quantité à acheter", default: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
