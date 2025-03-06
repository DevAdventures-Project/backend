import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserEntity } from "../users/entities/user.entity";
import { PurchaseItemDto } from "./dto/purchase-item.dto";
import { MarketplaceService } from "./marketplace.service";

@ApiTags("marketplace")
@Controller("marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("purchase")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Item purchased successfully" })
  @HttpCode(HttpStatus.CREATED)
  async purchaseItem(
    @Req() req: { user: UserEntity }, // Récupération de l'utilisateur depuis le token
    @Body() purchaseItemDto: PurchaseItemDto,
  ) {
    return await this.marketplaceService.purchaseItem({
      ...purchaseItemDto,
      userId: req.user.id,
    });
  }

  // Route pour supprimer (décrémenter) un item de l'inventaire.
  // Par défaut, on supprime 1 unité si le query param "quantity" n'est pas fourni.
  @Delete("inventory/:itemId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Item removed successfully from inventory" })
  async removeItemFromInventory(
    @Req() req: { user: { id: number } },
    @Param("itemId", ParseIntPipe) itemId: number,
    @Query("quantity") quantityQuery: string,
  ) {
    const quantity = quantityQuery ? Number.parseInt(quantityQuery, 10) : 1;
    return await this.marketplaceService.removeItemFromInventory({
      userId: req.user.id,
      itemId,
      quantity,
    });
  }
}
