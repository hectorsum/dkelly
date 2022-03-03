import { CustomerType } from "../action-types/customer";
import { OrderType } from "../action-types/order";
import { CustomerAction, CustomerState } from "../actions/customer";
import { OrderAction, OrderState } from "../actions/order";

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: true,
  error: null,
}

const reducer = (state: OrderState = initialState, action: OrderAction) => {
  switch(action.type){
    case OrderType.RETRIEVE_ALL:
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null,
      }
    case OrderType.RETRIEVE_SINGLE_ORDER:
      return {
        ...state,
        order: action.payload,
        loading:false,
        error:null
      }
    case OrderType.ADD:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        loading: false,
        error: null
      }
    case OrderType.EDIT:
      return {
        ...state,
        loading: false,
        orders: state.orders.map(order => order._id === action.payload._id ? order = action.payload : order)
      }
    case OrderType.DELETE:
      return {
        ...state,
        loading: false,
        orders: state.orders.filter(order => order._id !== action.payload)
      }
    case OrderType.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    default:
      return state;
  }
}

export default reducer;