/* eslint-disable react/prop-types */
import React from 'react'

function Prayers({name ,time,img}) {
  return (
    <>
        <div className='card'>
            <img className='oo' src={img} alt="sss"/>
                
            <div>
                  <h3>{name}</h3>
                  <h2>{time }</h2>
            </div>
        </div>
    </>
  )
}

export default Prayers