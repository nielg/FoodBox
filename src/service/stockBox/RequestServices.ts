import StockRepository from "@/repository/stockBox/StockRepository";

const createRequest = (user_id: number, item_id: number, quantity: number) =>
  StockRepository.createRequest(user_id, item_id, quantity);

const addRequestQuantity = (
  user_id: number,
  item_id: number,
  quantity: number,
) => StockRepository.addRequestQuantity(user_id, item_id, quantity);

const removeRequestQuantity = (
  user_id: number,
  item_id: number,
  quantity: number,
) => StockRepository.removeRequestQuantity(user_id, item_id, quantity);

const RequestService = {
  createRequest,
  addRequestQuantity,
  removeRequestQuantity,
};

export default RequestService;
