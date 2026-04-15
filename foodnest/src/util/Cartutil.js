export const calculateCartTotal = (cartItem, quantity) => {
    const subTotal = cartItem.reduce((acc, food) => acc + food.price * quantity[food.id], 0);
    const shipping = subTotal === 0 ? 0.0 : 10;
    const tax = subTotal * 0.1;
    const total = subTotal + shipping + tax;


    return {        
        subTotal,
        shipping,
        tax,
        total
    };
}