import React from 'react';
import { useRef } from 'react';
import './ExploreMenu.css';
import {categories} from './../../assets/Images/assets';

function ExploreMenu({category, setCategory}) {

    const menuRef = useRef(null);

    const scrollLeft = () => {
        if(menuRef.current){
            menuRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if(menuRef.current){
            menuRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

  return (
    <div>
        <div className="explore-menu position-relative mt-4">
            <h1 className='d-flex align-item-center justify-content-between'>
                Exlore Our Menu
                <div className='d-flex'>
                    <i className='bi bi-arrow-left-circle scroll-icon' onClick={scrollLeft}></i>
                    <i className='bi bi-arrow-right-circle scroll-icon' onClick={scrollRight}></i>
                </div>
            </h1>
            <p>Explore a variety of delicious dishes from different categories.</p>
            <div className='d-flex justify-content-between gap-4 overflow-auto explore-menu-list' ref={menuRef}>
                {
                    categories.map((item, index) => {
                        return(
                            <div className='text-center explore-menu-list-item' key={index} onClick={() =>{setCategory( prev => prev === item.category ? 'All' : item.category)}}>
                                <img src={item.icon} alt="" className={item.category === category ? 'rounded-circle active' : 'rounded-circle'} height={128} width={128} />
                                <p className='mt-2 fx-bold'>{item.category}</p>
                            </div>
                        )
                    })
                }
            </div>
        <hr />
        </div>
    </div>
  )
}

export default ExploreMenu;