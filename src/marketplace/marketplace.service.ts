import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PurchaseItemDto } from "./dto/purchase-item.dto";

interface PurchaseItemInput extends PurchaseItemDto {
  userId: number;
}

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async purchaseItem(purchaseDto: PurchaseItemInput) {
    const { userId, itemId, quantity } = purchaseDto;

    // Vérifier l'existence de l'utilisateur
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Vérifier l'existence de l'item
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    // Calculer le prix total
    const totalPrice = item.price * quantity;
    if (user.coins < totalPrice) {
      throw new BadRequestException("Not enough coins");
    }

    // Déduire le montant des coins de l'utilisateur
    await this.prisma.user.update({
      where: { id: userId },
      data: { coins: user.coins - totalPrice },
    });

    // Vérifier si l'utilisateur possède déjà cet item dans son inventaire
    const existingEntry = await this.prisma.userItem.findFirst({
      where: { userId, itemId },
    });

    if (existingEntry) {
      // Mettre à jour la quantité
      await this.prisma.userItem.update({
        where: { id: existingEntry.id },
        data: { quantity: existingEntry.quantity + quantity },
      });
    } else {
      // Créer une nouvelle entrée d'inventaire
      await this.prisma.userItem.create({
        data: {
          userId,
          itemId,
          quantity,
        },
      });
    }

    return { message: "Purchase successful", coinsSpent: totalPrice };
  }

  async removeItemFromInventory({
    userId,
    itemId,
    quantity,
  }: {
    userId: number;
    itemId: number;
    quantity: number;
  }) {
    // Recherche l'entrée dans l'inventaire pour cet utilisateur et cet item
    const userItem = await this.prisma.userItem.findFirst({
      where: { userId, itemId },
    });
    if (!userItem) {
      throw new NotFoundException("Item not found in inventory");
    }

    if (quantity > userItem.quantity) {
      throw new BadRequestException(
        "You are trying to remove more items than you have",
      );
    }

    if (quantity === userItem.quantity) {
      // Supprimer l'entrée si la quantité devient 0
      return this.prisma.userItem.delete({
        where: { id: userItem.id },
      });
    }
    // Sinon, mettre à jour la quantité
    return this.prisma.userItem.update({
      where: { id: userItem.id },
      data: { quantity: userItem.quantity - quantity },
    });
  }
}
