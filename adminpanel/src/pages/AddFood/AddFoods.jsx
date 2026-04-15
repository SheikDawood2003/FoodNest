import React, { useState } from 'react';
import { assets } from '../../assets/assest';
import { addFood } from '../../assets/services/foodservice';
import { toast } from 'react-toastify';


function AddFoods() {

    const[image, setImage] = useState(false);
    const [foodData, setFoodData] = useState({
        name: '',
        category: '',
        price: '',
        description: ''
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFoodData(data => ({...data, [name]: value}));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if(!image){
            toast.error("Please upload an image");
            return;
        }

        try{
            await addFood(foodData, image);
            toast.success("Food added successfully");
            setFoodData({
                name: '',
                category: '',
                price: '',
                description: ''
            });
            setImage(null);
        } catch (error) {
            toast.error("Error adding food");
            console.log("Error:", error);
        }
    };


  return (
    <div>
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-4">
                <div className="card-body">
                    <h2 className="mb-4">Add Food</h2>
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                        <label htmlFor="foodimage" className="form-label">
                            <img src={image ? URL.createObjectURL(image) : assets.upload} alt="Upload Image" width={98} />
                        </label>
                        <input type="file" className="form-control" id="foodimage" hidden onChange={(e)=> setImage(e.target.files[0])}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="foodname" className="form-label">Food Name</label>
                        <input type="text" className="form-control" placeholder='Food Name' id="foodname" required name='name' onChange={onChangeHandler} value={foodData.name}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select name="category" id="category" className="form-control" required onChange={onChangeHandler} value={foodData.category}>
                            <option value="" disabled>Select a category</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Cake">Cake</option>
                            <option value="Burger">Burger</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Ice Cream">Ice Cream</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Salad">Salad</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input type="number" className="form-control" placeholder='₹200' id="price" required name='price' onChange={onChangeHandler} value={foodData.price}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" placeholder='Enter the content here...' rows="5" required name='description' onChange={onChangeHandler} value={foodData.description}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Food</button>
                    </form>
                </div>
                </div>
            </div>
            </div>
    </div>
  )
}


export default AddFoods;
