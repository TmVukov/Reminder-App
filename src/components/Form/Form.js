import React, { useState, useContext } from 'react'
import "./Form.css"
import database from "../../firebase"
import Alarm from "../Alarm/Alarm"
import { StateContext } from "../../StateProvider"
import { MdTitle } from 'react-icons/md'
import { MdDescription } from 'react-icons/md'
import { CirclePicker } from 'react-color'
import { convertDateToMs } from "../../utils/utils"


export default function Form() {
    const [open, setOpen] = useState(false)
        
    
    const { 
        title, setTitle, 
        description, setDescription, 
        alarmDisplay, setAlarmDisplay, 
        setAlarmDate, setAlarmTime, 
        setColor, color,
        intervalID, 
        reminders
    } = useContext(StateContext) 
    
    
    const saveReminder = () =>{
        database.collection("reminders").add({
            title: title,
            description: description,                        
            alarmDisplay: alarmDisplay,
            intervalID: intervalID.slice(-1), 
            color: color,                                                    
        })        

        setTitle("")
        setDescription("")
        setAlarmDate(null)
        setAlarmTime(null)
        setAlarmDisplay([])
        setColor("")                    
    }   
    

    const getColor = (color) =>{
         setColor(color.hex)
    } 
    
    
    return (
        <div className="form__container">
            <h1>Add reminder</h1>

            <form className="form">                
               <div className="form__box">

                    <MdTitle className="form__title-icon"/>

                    <input 
                        type="text"
                        placeholder="Add title..." 
                        maxLength="30"                        
                        value={title} 
                        onChange={e=>setTitle(e.target.value)} 
                        
                    />
               </div>

               { title.length===30 && <p className="form__title-msg">Sorry, allowed title length is 30 characters.</p> }

               <div className="form__box">
                    <MdDescription className="form__description-icon"/>

                    <input 
                        type="text"
                        placeholder="Add description..." 
                        maxLength="200" 
                        value={description} 
                        onChange={e=>setDescription(e.target.value)}                        
                    />                   
               </div>

               { description.length===200 && <p className="form__description-msg">Sorry, allowed description length is 200 characters.</p> }
            </form>

            <button className="form__btn-color" onClick={()=>setOpen(!open)}>Select color</button>

            { open && <CirclePicker width="220px" circleSize={20} onChangeComplete={getColor}/>}

            <Alarm/>            
                
            <button
                className="form__btn" 
                onClick={saveReminder} 
                disabled={
                    !alarmDisplay.length || 
                    reminders.some(e=>e.alarmDisplay[0] === alarmDisplay[0]) ||
                    convertDateToMs(alarmDisplay) < new Date().getTime() ? 
                    true : false
                }
                >Save reminder
            </button>                       
                        
        </div>
    )
}
