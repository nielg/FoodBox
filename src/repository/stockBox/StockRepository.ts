import {
  addItemQuantity,
  createStockItem,
  removeItemQuantity,
} from "./itemBatch/mutations";
import { getStockInventory, getStockItems } from "./itemBatch/queries";
import {
  addRequestQuantity,
  createRequest,
  removeRequestQuantity,
} from "./requests";

const StockRepository = {
  getStockItems,
  getStockInventory,
  createStockItem,
  addItemQuantity,
  removeItemQuantity,
  addRequestQuantity,
  createRequest,
  removeRequestQuantity,
};

export default StockRepository;
