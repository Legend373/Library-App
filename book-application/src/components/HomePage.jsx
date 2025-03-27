import React from 'react'
import "./HomePage.css"
import BookList from './BookList'

const HomePage = () => {
    return (
        <div class="Hero">
            <div className="z-10 text-center py-8 md:py-12 lg:py-16 px-4  text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">WELCOME TO ABREHOTE LIBRARY</h1>
                <h2 className="mt-4 sm:mt-5 text-lg sm:text-xl md:text-2xl font-medium">
                    Where Exploration Knows No Bounds!!
                </h2>
            </div>
            <div class=" mt-10 text-center">
                <BookList />


            </div>

        </div>
    )
}

export default HomePage
