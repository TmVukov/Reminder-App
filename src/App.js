import React, { useState } from 'react'
import './App.css';
import Form from "./components/Form/Form"
import Reminder from "./components/Reminder/Reminder"
import Notification from "./components/Notification/Notification"
import { BiWindowOpen } from "react-icons/bi"
import { BiWindowClose } from "react-icons/bi"
import { motion } from "framer-motion"


function App() {
  const [open, setOpen] = useState(false)    
  
  const variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "100%" }    
  } 
  
  const bounce = {
    duration: 0.3,
    yoyo: Infinity,
    ease: "easeOut"
  }  
    

  return (
    <div className="App">
      
      {
        open ? 

        <BiWindowClose className="App__btn-close" onClick={()=>setOpen(false)}/> :

        <motion.div
          className="App__btn-open"
          transition={bounce}        
          animate={{y: ["15%", "-15%"]}}
        >          
          <BiWindowOpen onClick={()=>setOpen(true)}/>          
        </motion.div>
      }     
      
        <motion.div
          animate={open ? "open" : "closed"}
          variants={variants} 
          className="App__container"
        >
            <div className="App__left">
              <Form/>
            </div>
            
            <div className="App__right">
              <Reminder/>
            </div>
        </motion.div>       
                          
        <Notification/>

    </div>
  );
}

export default App;