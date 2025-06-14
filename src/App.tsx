import {Routes, Route } from "react-router";
import Home from './pages/Home'
import "../src/index.css";
function App() {


  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
        
        </Routes>
    </>
  )
}

export default App
