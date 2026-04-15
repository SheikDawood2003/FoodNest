import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem';

function FoodDisplay( {category ,searchText} ) {

  const { foodList } = useContext(StoreContext);

  const filteredFoodList = foodList.filter(food =>(
     (category === "All" || food.category === category) && 
      food.name.toLowerCase().includes(searchText.toLowerCase())
  ));

  return (
    <div>
      <div className="container">
        <div className='row'>
          {
            filteredFoodList.length > 0 ? (
              filteredFoodList.map((food, index) =>(
                  <FoodItem key={index} 
                    id={food.id}
                    name={food.name} 
                    description={food.description} 
                    price={food.price} 
                    imageUrl={food.imageUrl} 
                  />
              ))

            ) : (
              <div className="text-center mt-4">
                <h3>No foods available</h3>
              </div>
              )
          }
        </div>
      </div>
    </div>
  )
}

export default FoodDisplay