import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useEffect, useState } from 'react';
import { addFavourite, removeFavourite } from './features/favouritesSlice';
import { ShowToast } from '@/components/UI/ShowToast';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface IDebounced {
    searchQuery: string;
    delay: number;
  }
   
export const useDebounced = ({searchQuery,delay}:IDebounced) => {
   const [debouncedValue,setDebouncedValue] = useState<string>(searchQuery);
   
   useEffect(()=>{
    const handler = setTimeout(()=>{
        setDebouncedValue(searchQuery);
    },delay)

    return () => {
        clearTimeout(handler);
    }
   },[searchQuery, delay]);
   
   return debouncedValue;
}

export const useFavourites = () => {
    const dispatch = useDispatch();
    const favouriteServices = useSelector((state: any) => state.favourites.favouriteServices);
  
    const isServiceFavourite = (serviceId: number) => {
      return favouriteServices.some((service: any) => service.id === serviceId);
    };
  
    const handleFavouriteClick = (service: any) => {
      if (isServiceFavourite(service.id)) {
        dispatch(removeFavourite(service.id));
        ShowToast({
            message:'Removed From Favourite Successfully'
        })
      } else {
        dispatch(addFavourite(service));
        ShowToast({
            message:'Added To Favourite Successfully'
        })
      }
    };
  
    return {
      favouriteServices,
      isServiceFavourite,
      handleFavouriteClick,
    };
  };