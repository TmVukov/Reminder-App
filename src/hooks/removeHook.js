import { useContext } from 'react';
import { StateContext } from '../StateProvider';
import database from '../firebase';

export default function RemoveReminderHook() {
  const {
    reminders,
    setAlarmStart,
    intervalID,
    setIntervalID,
    newIntervalID,
    setNewIntervalID,
    setAlarmDisplay,
    savedAlarms,
    setSavedAlarms,
  } = useContext(StateContext);

  const removeReminder = (id, i) => {
    //delete reminder from firestore
    database.collection('reminders').doc(id).delete();

    //page doesn't refresh - take care of the intervals
    let clonedIntervals = [...intervalID];
    let removedIntervals = [];
    let filteredIntervals = [];

    removedIntervals = clonedIntervals.filter(
      (e) => e === reminders[i].intervalID[0],
    );
    filteredIntervals = clonedIntervals.filter(
      (e) => e !== reminders[i].intervalID[0],
    );

    clearInterval(removedIntervals);
    setIntervalID(filteredIntervals);

    //page refresh - take care of new intervals
    let clonedNewIntervals = [...newIntervalID];

    clearInterval(clonedNewIntervals.splice(0, 1));
    setNewIntervalID(clonedNewIntervals);

    //remove saved alarm & trigger the new setInterval inside useEffect
    let clonedAlarms = [...savedAlarms];
    let filteredAlarms = clonedAlarms.filter(
      (e) => e !== reminders[i].alarmDisplay[0],
    );
    setSavedAlarms(filteredAlarms);

    //notification will be removed only if its oldest alarm/last reminder
    if (reminders[reminders.length - 1].id === reminders[i].id)
      setAlarmStart(false);

    setAlarmDisplay([]);
  };

  return removeReminder;
}

