import { useEffect, useState } from "react";
import React from 'react';
import { toast } from "react-toastify";
import './ListFoods.css';
import { getFoods, deleteFood } from "../../assets/services/foodservice";

function ListFoods() {

  const [list, setList] = useState([]);

  const fetchList = async() =>{
    try {
      const data = await getFoods();
      setList(data);
    } catch (error) {
      toast.error("Failed to fetch food items");
      console.log("Error:", error);
      
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  const removeItem = async(id) => { 
    try {
      const success = await deleteFood(id);
      if (success) {
        toast.success("Food item removed successfully");
        await fetchList();
      } else {
        toast.error("Failed to remove food item");
      }
    } catch (error) {
      toast.error("Failed to remove food item");
      console.log("Error:", error);
    }
  }

  return (
    <div>
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td><img src={item.imageUrl} alt={item.name} height={48} width={48} /></td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td className="text-danger">
                        <i className="bi bi-x-circle-fill" style={{ cursor: 'pointer' }} onClick={() => removeItem(item.id)}></i>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


export default ListFoods;
