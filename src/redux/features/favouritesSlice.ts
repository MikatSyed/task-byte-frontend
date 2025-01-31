import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavouriteService {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

interface FavouritesState {
  favouriteServices: FavouriteService[];
}

// Helper function to check if code is running on the client-side
const isBrowser = typeof window !== "undefined";

// Helper function to load favorites from localStorage
const loadFavouritesFromLocalStorage = (): FavouriteService[] => {
  try {
    if (isBrowser) {
      const serializedState = localStorage.getItem("favouriteServices");
      if (serializedState === null) {
        return []; // Return an empty array if no favorites are found
      }
      return JSON.parse(serializedState);
    }
  } catch (error) {
    console.error("Could not load favorite services from localStorage", error);
  }
  return [];
};

// Helper function to save favorites to localStorage
const saveFavouritesToLocalStorage = (favourites: FavouriteService[]) => {
  try {
    if (isBrowser) {
      const serializedState = JSON.stringify(favourites);
      localStorage.setItem("favouriteServices", serializedState);
    }
  } catch (error) {
    console.error("Could not save favorite services to localStorage", error);
  }
};

// Set the initial state by loading from localStorage
const initialState: FavouritesState = {
  favouriteServices: loadFavouritesFromLocalStorage(),
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<FavouriteService>) => {
      if (!state.favouriteServices.some(service => service.id === action.payload.id)) {
        state.favouriteServices.push(action.payload);
        saveFavouritesToLocalStorage(state.favouriteServices); // Save to localStorage after adding
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.favouriteServices = state.favouriteServices.filter(
        service => service.id !== action.payload
      );
      saveFavouritesToLocalStorage(state.favouriteServices); // Save to localStorage after removing
    },
  },
});

export const { addFavourite, removeFavourite } = favouritesSlice.actions;

export default favouritesSlice.reducer;
