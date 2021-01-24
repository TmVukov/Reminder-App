import React, { useState, createContext } from 'react'

export const StateContext = createContext()

export default function StateProvider({children}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [reminders, setReminders] = useState([]) 
    const [alarmDate, setAlarmDate] = useState("")
    const [alarmTime, setAlarmTime] = useState("")
    const [alarmStart, setAlarmStart] = useState(false)
    const [intervalID, setIntervalID] = useState([])
    const [newIntervalID, setNewIntervalID] = useState([])    
    const [alarmDisplay, setAlarmDisplay] = useState([])
    const [savedAlarms, setSavedAlarms] = useState([])       
    const [color, setColor] = useState("")     
   

    return (
        <StateContext.Provider value={{
            title, setTitle, 
            description, setDescription, 
            reminders, setReminders,
            alarmDate, setAlarmDate, 
            alarmTime, setAlarmTime, 
            alarmStart, setAlarmStart, 
            intervalID, setIntervalID,
            newIntervalID, setNewIntervalID, 
            alarmDisplay, setAlarmDisplay,
            savedAlarms, setSavedAlarms,            
            color, setColor,         
            }}>
            {children}
        </StateContext.Provider>
    )
}