//page.tsx
'use client'
import React, { useState } from 'react';
import PendingCalendar from '@/app/components/PendingCalendar';
import { useEffect } from 'react';
import { fetchCalendarData } from '@/utils/supabase/data';

const Page = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = fetchCalendarData(selectedDate);
      } catch (error) { 

      }
    }

    getData();
  }, [selectedDate])

  return (
    <div className='px-32 flex flex-col gap-8 mb-6 mt-20'>
      <div className="flex">
        <PendingCalendar setArrFunc={setSelectedDates} setSelectedDate={setSelectedDate} />

        
        {selectedDate && (
          <div className="reservation-details ml-8 mt-6 p-4 border border-gray-300 rounded-lg w-2/3 h-shadow-lg bg-white text-black flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-left">Details</h2>
              
              <div className="flex justify-between mb-4">
                <div className="details p-2 border border-cusBlue rounded w-1/2 mr-2">
                  <p className="font-bold">Main customer:</p>
                  <div className="pl-4">
                    <p>Name: Austin</p>
                    <p>Email: austin@gmail.com</p>
                    <p>Phone Number: 09165475437457</p>
                  </div>
              </div>
                
                <div className="details p-2 border border-cusBlue rounded w-1/2 ml-2">
                  <p className="font-bold">Additional persons involved:</p>
                  <div className="pl-4">
                    <p>Person 1: Name</p>
                    <p>Person 2: Name</p>
                    <p>Person 3: Name</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mb-4">
                <div className="details p-2 border border-cusBlue rounded w-1/2 mr-2">
                  <p className="font-bold">Parking</p>
                  <div className="pl-4">
                    <p>Parking Needed: No</p>
                  </div>
                </div>
                
                <div className="details p-2 border border-cusBlue rounded w-1/2 ml-2">
                  <p className="font-bold">Reservation Details:</p>
                  <div className="pl-4">
                    <p>Package Selected: Recording Session</p>
                    <p>Date/s: {formatDate(selectedDate)}</p>
                    <p>Start Time: 10:00 AM</p>
                    <p>End Time: 11:00 AM</p>
                    <p>Additional request/s:</p>
                    {/* fill in data according to populating */}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <button className="bg-green-600 font-bold text-white px-4 py-2 rounded-3xl w-40">Accept</button>
              <button className="bg-rose-700 font-bold text-white px-4 py-2 rounded-3xl mr-2 w-40">Reject</button>
            </div>
          </div>
        )}
      </div>

      <div className="legend flex mt-0">
        <div className="legend-item flex items-center mr-4">
          <span className="bg-yellow-400 inline-block w-4 h-4 mr-2"></span>
          <span className="font-bold text-black">Pending</span>
        </div>
        <div className="legend-item flex items-center">
          <span className="bg-green-700 inline-block w-4 h-4 mr-2"></span>
          <span className="font-bold text-black">Reserved</span>
        </div>
      </div>
    </div>
  );
}

export default Page;
