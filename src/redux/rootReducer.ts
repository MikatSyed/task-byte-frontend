import { baseApi } from "./api/baseApi";
import favouritesReducer from "./features/favouritesSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  favourites: favouritesReducer,
};
