import React from 'react'

const HeaderBtn = function(props){
    return (
        <button className='headerBtn' {...props}>
            {props.value}
        </button>
    )
}

export default HeaderBtn