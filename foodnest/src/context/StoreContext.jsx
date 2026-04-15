import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodservice";
import { addToCart, clearCart, getCartData, removeQtyFromCart } from "../service/CartService";
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = ( props ) => {

    const [foodList, setFoodList] = useState([]);
    const [quantity, setQuantity] = useState({});

    const [token, setToken] = useState();

    const increaseQuantity = async (foodId) =>{
        setQuantity (prev =>({...prev,[foodId]: (prev[foodId] || 0) + 1}));
        await addToCart(foodId,token);
        
    };

    const clearCartHandler = async () => {
        await clearCart(token);
        setQuantity({}); // IMPORTANT: reset frontend state
    };

    const decreaseQuantity = async (foodId) =>{
        setQuantity (prev =>({...prev,[foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0}));
        await removeQtyFromCart(foodId,token);
    };

    const removeFromCart = async (foodId) => {
        await axios.delete(`http://localhost:8080/api/cart/remove/${foodId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setQuantity(prev => {
            const updated = { ...prev };
            delete updated[foodId];
            return updated;
        });
    };


    const loadCartData = async (token) => {
        const item = await getCartData(token);
        setQuantity(item);
    }

    const contextValue = {
        foodList,
        increaseQuantity,
        decreaseQuantity,
        quantity,
        setQuantity,
        removeFromCart,
        token,
        setToken,
        loadCartData,
        clearCartHandler
    };

    useEffect(() =>{
        async function loadData(){
            const data = await fetchFoodList();
            setFoodList(data);
            if(localStorage.getItem('token')){
                setToken(localStorage.getItem('token'));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);


    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}