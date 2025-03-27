import React from 'react'
import "./HomePage.css"
import BookList from './BookList'

const HomePage = () => {
    return (
        <div class="Hero">
            <div class="z-1  text-center pt-5 text-white  ">
                <h1 class="text-5xl" >WELLCOME TO ABREHOTE LIBRARY</h1>
                <h2 class="w-150 text-xl mt-5 ml-70">Where Exploration Knows No Bounds!!</h2>
            </div>
            <div class=" mt-10 text-center">
                <BookList />


            </div>

        </div>
    )
}

export default HomePage
