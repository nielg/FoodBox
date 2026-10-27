import StockRepository from "@/repository/stockBox/StockRepository";

const addItemQuantity = (
  user_id: number,
  item_id: number,
  quantity: number,
  expireDate: string,
) => StockRepository.addItemQuantity(user_id, item_id, quantity, expireDate);

const removeItemQuantity = (
  user_id: number,
  item_id: number,
  quantity: number,
  expireDate: string,
) => StockRepository.removeItemQuantity(user_id, item_id, quantity, expireDate);

const BatchService = {
  addItemQuantity,
  removeItemQuantity,
};

export default BatchService;
