import React, { useContext } from 'react'
import "./Notification.css"
import { motion } from "framer-motion"
import { StateContext } from "../../StateProvider"
import useRemoveReminder from "../../hooks/removeHook"

export default function Notification() {
    
    const colors = ["#607d8b", "#795548", "#3f51b5", "#673ab7"]
    
    const { reminders, alarmStart } = useContext(StateContext)
    
    const removeCallback = useRemoveReminder()  
    
    
    return (        
        <div className="notification__container">
            {
                reminders[reminders.length-1] && alarmStart &&    
                    <motion.div                    
                        className="notification"
                        style={{backgroundColor: reminders[reminders.length-1].color}}
                        animate={{ translateX: [80, -80, 60, -60, 40, -40, reminders.length-1]}}
                    >
                        <p 
                            style={
                                colors.includes(reminders[reminders.length-1].color) ? 
                                {color: "#ffffff"} : {color: "#000000"}
                            }
                        >
                            Reminder for: <br></br> 
                            <strong>
                                {
                                    reminders[reminders.length-1].title.length > 15 ? 
                                    reminders[reminders.length-1].title.slice(0,15) + "..." : 
                                    reminders[reminders.length-1].title
                                }
                            </strong> <br></br> at {reminders[reminders.length-1].alarmDisplay[0].slice(0,-3)}                            
                        </p>

                        <button
                            className="notification__btn" 
                            onClick={()=>removeCallback(reminders[reminders.length-1].id, reminders.length-1)}
                            style={
                                colors.includes(reminders[reminders.length-1].color) ? 
                                {color: "#ffffff"} : {color: "#000000"}
                            }
                        >
                            ✕
                        </button>           
                    </motion.div>
            }
        </div>        
    )
}

