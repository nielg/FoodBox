import StockRepository from "@/repository/stockBox/StockRepository";
import type { StockItemRequest } from "@/types/stock/stock.schema";

const getInventoryByUserId = (user_id: number) => {
  return StockRepository.getStockInventory(user_id);
};

const createStockItem = (user_id: number, item: StockItemRequest) => {
  return StockRepository.createStockItem(user_id, item);
};

const ItemService = {
  getInventoryByUserId,
  createStockItem,
};

export default ItemService;
