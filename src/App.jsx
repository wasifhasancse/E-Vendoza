import { Suspense } from 'react'
import './App.css'
import Hero from './components/Hero/Hero'
import Menu from './components/Menu/Menu'
import NavBar from './components/NavBar/NavBar'


const getCategoriesPromiseData = async () => {
  const categoriesPromise = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  return categoriesPromise.json()
}
const getCategoriesPromise = getCategoriesPromiseData()


function App() {

  return (
    <>
      <NavBar />
      <Hero />

      <Suspense fallback={<div className='text-center text-2xl font-bold text-[#1f2435] py-20'>Loading...</div>}>
        <Menu getCategoriesPromise={getCategoriesPromise} />
      </Suspense>

    </>
  )
}

export default App
