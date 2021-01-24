import React, { useState, useContext, useEffect, useCallback } from 'react'
import "./Alarm.css"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import TimePicker from 'react-time-picker'
import { StateContext } from "../../StateProvider"
import database from "../../firebase"
import { AiOutlineCheck } from 'react-icons/ai'
import { AiOutlineClose } from 'react-icons/ai'
import { convertDateToMs } from "../../utils/utils"


export default function ReactCalendar() {         
    const [discarded, setDiscarded] = useState(false)

    const {
        reminders,        
        alarmDate, setAlarmDate,
        alarmTime, setAlarmTime, 
        alarmStart, setAlarmStart, 
        intervalID, setIntervalID, 
        alarmDisplay, setAlarmDisplay,        
        savedAlarms, setSavedAlarms,        
        newIntervalID,setNewIntervalID                       
    } = useContext(StateContext)    
   
      
    const selectDate = (value) =>{        
        setAlarmDate(value.toLocaleDateString('en-GB'))                
    }    
    

    const selectTime = value =>{              
        setAlarmTime(value + ":00")     
    }    

    
    const compareInputTime = () =>{
        let todayDate = new Date().toLocaleDateString('en-GB')        
        console.log(todayDate)

        let todayTime = new Date().toLocaleTimeString('en-GB')        
        console.log(todayTime)

        const isDateEqual = todayDate === alarmDate
        const isTimeEqual = todayTime === alarmTime
        
        if(isDateEqual && isTimeEqual) {
            let sound = new Audio("Audio/alarmSound.mp3")                     
            sound.play()
            setAlarmStart(true)            
        }        
    }
            
        
    const startAlarm = () =>{
        let display = `${alarmDate}/${alarmTime}`                      
        setAlarmDisplay(prevDisplay=>([...prevDisplay, display]))       
        
        let interval = setInterval(compareInputTime, 1000)        
        setIntervalID(prevInterval=>([...prevInterval, interval]))      
        
        setDiscarded(false)        
    }
       

    const discardAlarm = ()=>{
        if(alarmDisplay.length){
            let clonedIntervals = [...intervalID]
            if(clonedIntervals.length > 1){
                clearInterval(clonedIntervals.splice(-1,1))        
                setIntervalID(clonedIntervals)
            }       
            else{
                clearInterval(clonedIntervals.splice(0, 1))        
                setIntervalID(clonedIntervals)  
            }  
        }
        setAlarmDate(null)
        setAlarmTime(null)
        setAlarmDisplay([])
        setDiscarded(true)       
    }
    

    //get alarms from firestore
    useEffect(()=>{
        database.collection("reminders").get()
            .then(snap => {
                let alarms=[]
                snap.forEach(doc=>alarms.push(doc.data().alarmDisplay))
                setSavedAlarms(alarms.flat())                
            })
    }, [setAlarmDate, setAlarmTime, setSavedAlarms])


    const compareDatabaseTime = useCallback(()=>{

        //sort alarms from oldest to newest
        let clonedAlarms = [...savedAlarms].sort((a,b)=> a < b ? -1 : 1)  
        
        //convert alarms to ms
        let alarmsInMs = convertDateToMs(clonedAlarms)        
        
        //get the smallest date
        let firstAlarm = Math.min(...alarmsInMs)            
        
        //convert ms into date
        let dbDate = new Date(firstAlarm).toLocaleDateString('en-GB')            
        console.log(dbDate)

        //convert ms into time
        let dbTime = new Date(firstAlarm).toLocaleTimeString("en-GB")
        console.log(dbTime)

        let todayDate = new Date().toLocaleDateString('en-GB')        
        console.log(todayDate)

        let todayTime = new Date().toLocaleTimeString('en-GB')        
        console.log(todayTime)

        const isDateEqual = todayDate === dbDate
        const isTimeEqual = todayTime === dbTime

        if(isDateEqual && isTimeEqual) {
            let sound = new Audio("Audio/alarmSound.mp3")                     
            sound.play()
            
            setAlarmStart(true)        
        }      
    
    }, [savedAlarms, setAlarmStart])    
   
     
   //set new interval when page refreshes
    useEffect(()=>{             
            if(savedAlarms.length) {              
                let interval = setInterval(compareDatabaseTime, 1000)
                setNewIntervalID([interval])            
            }                           
    }, [compareDatabaseTime, savedAlarms.length, setNewIntervalID])   
    
    
    
    const autoRemoveReminder = useCallback(()=>{

        //automatically remove reminder from firestore
        database.collection("reminders").orderBy("alarmDisplay").limit(1).get().then(snap=>{
          if(!snap.empty){
            let doc = snap.docs[0]
            return doc.ref.delete()
          }
      }) 
      
      if(savedAlarms.length){
        //trigger the new interval inside useEffect
        let clonedAlarms = [...savedAlarms].sort((a,b)=> a < b ? -1 : 1)      
        clonedAlarms.splice(0,1)                 
        setSavedAlarms(clonedAlarms)

       //clears new interval
       let clonedNewIntervals = [...newIntervalID]
       clearInterval(clonedNewIntervals.splice(0,1))   
       setNewIntervalID(clonedNewIntervals)
      }
      else{
        //clears old interval
        let clonedIntervals = [...intervalID]       
        clearInterval(clonedIntervals.splice(0,1))        
        setIntervalID(clonedIntervals)
      }    
              
    }, [savedAlarms, setSavedAlarms, intervalID, setIntervalID, newIntervalID, setNewIntervalID])
         
    
    //if not cleared, reminder will be autoremoved after 30 sec
    useEffect(()=>{        
        if(alarmStart) {
           let timer = setTimeout(()=>{
                setAlarmStart(false)                                             
                autoRemoveReminder()                                                                        
            }, 30000)
            
            return () => {
                clearTimeout(timer)
              }
        }
    }, [alarmStart, setAlarmStart, autoRemoveReminder]) 
      
    
    
    return (
        <div className="alarm__container">
            
            <Calendar 
                locale="en" 
                tileClassName={["react-calendar", "react-calendar__navigation__label"]}               
                onChange={selectDate}                          
            />
            
            <TimePicker
                clearIcon={null}        
                disableClock
                hourPlaceholder="hours"
                minutePlaceholder="minutes"      
                onChange={selectTime}
                value={alarmTime}
                tileClassName={["react-time-picker_wrapper"]}              
            />            

            <div className="alarm__message">

                {                  
                   !alarmDate && !alarmTime && discarded ? <p>Alarm discarder. Please add new alarm.</p> :                   
                   !alarmDate && !alarmTime ? "" :                    
                   !alarmDate ? <p>Please select date.</p> :
                   reminders.some(e=>e.alarmDisplay[0] === alarmDisplay[0]) ? <p>Alarm is already set!</p> : 
                   alarmDisplay.length && convertDateToMs(alarmDisplay) < new Date().getTime() ? <p>Alarm is not valid! Please discard it.</p> :
                   alarmDisplay.length ? <p>Alarm is saved!</p> :                                                        
                   alarmDisplay && alarmTime ? <p>Save alarm at {alarmDate}/{alarmTime.slice(0,5)} ?</p> : ""            
                } 
                                
                {
                    alarmDate && alarmTime && 
                    <div>
                        <button className="alarm__icon-check" disabled={alarmDisplay.length ? true : false}>
                            <AiOutlineCheck onClick={startAlarm} />
                        </button>

                        <AiOutlineClose onClick={discardAlarm} className="alarm__icon-close"/>
                    </div>
                }                
                                
            </div>            
                
        </div>
    )
}  



