import React, { useState, useEffect, useContext } from 'react'
import "./Reminder.css"
import database from "../../firebase"
import { StateContext } from "../../StateProvider"
import useRemoveReminder from "../../hooks/removeHook"

export default function Reminder() { 
    const [editTitle, setEditTitle] = useState(false)  
    const [editDescription, setEditDescription] = useState(false)
    const [id, setId] = useState(null)  
    
     
    const { 
        title, setTitle, 
        description, setDescription, 
        reminders, setReminders                     
    } = useContext(StateContext)    
    
    
    //get reminders from firestore
    useEffect(() => {
        database.collection("reminders").orderBy("alarmDisplay", "desc").onSnapshot(reminder => 
            setReminders(reminder.docs.map(e=>({...e.data(), id: e.id})))
        )        
    }, [setReminders]) 
    
    
    const handleTitle = (id) =>{
        setId(id)
        setEditTitle(true)              
    }


    const handleDescription = (id) =>{
        setId(id)
        setEditDescription(true)      
    }
    

    const updateTitle = (id) =>{        
        database.collection("reminders").doc(id).update({title: title})      
        setEditTitle(false)
        setTitle("")        
    }


    const updateDescription = (id) =>{
        database.collection("reminders").doc(id).update({description: description})
        setEditDescription(false)
        setDescription("")
    } 
    
    const removeCallback = useRemoveReminder()    
    
    
    return (
        <div className="reminder__container">
            <h1>Your Reminders</h1>

            {
               reminders.map((reminder, i)=>
                <div key={i} className="reminder__box" style={{borderColor: reminder.color}}>

                    <button 
                        className="reminder__btn"
                        onClick={()=>removeCallback(reminder.id, i)}
                    >
                        ✕
                    </button>
                             
                    {
                       editTitle && (id === reminder.id) ?

                        <div>
                            <input                                 
                                type="text"
                                placeholder="edit..." 
                                maxLength="30"
                                value={title} 
                                onChange={e=>setTitle(e.target.value)}                                
                                autoFocus
                            />

                            <button 
                                onClick={()=>updateTitle(reminder.id)} 
                                className="reminder__update"
                            >
                                Update
                            </button>

                            <button 
                                onClick={()=>setEditTitle(false)} 
                                className="reminder__cancel"
                            >
                                Cancel
                            </button>
                        </div> :
                        

                        <div 
                            onClick={()=>handleTitle(reminder.id)} 
                            className="reminder__title"
                        >
                            {reminder.title}
                        </div>
                    }

                    {
                        editDescription && (id === reminder.id) ?

                        <div>
                            <textarea 
                                type="text"
                                placeholder="edit..."
                                maxLength="200"  
                                value={description}  
                                onChange={e=>setDescription(e.target.value)} 
                                autoFocus
                            />

                            <button 
                                onClick={()=>updateDescription(reminder.id)} 
                                className="reminder__update"
                            >
                                Update
                            </button>

                            <button 
                                onClick={()=>setEditDescription(false)} 
                                className="reminder__cancel"
                            >
                                Cancel
                            </button>
                        </div> :

                        <div 
                            onClick={()=>handleDescription(reminder.id)} 
                            className="reminder__description"
                        >
                            {reminder.description}
                        </div>

                    }    
                   
                                                          

                    {
                        reminder.alarmDisplay.map((alarm,i)=>
                        <p key={i}>
                            {alarm.slice(0,-3)}                       
                        </p>
                        )
                    }                    

                </div>
           )}           
            
        </div>
    )
}

 