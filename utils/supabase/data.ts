'use server'

import { createClient } from '@/utils/supabase/server'
import { service } from '@/utils/supabase/interfaces'
import { NextApiRequest, NextApiResponse } from 'next'
import { findPerson } from '@/app/lib/actions'
import { permission } from 'process'


export async function fetchAppointments() {
    const supabase = createClient();
    const { data, error } = await supabase.from('Reservations').select();
    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
    return data;
}

export async function fetchSchedule() {
    const supabase = createClient();
    const { data, error } = await supabase.from('Schedule').select('*'); 

    if(error){
        return ["error", "error"]
    }
    if (data)
    {
        return data;
    }
}

export async function fetchOneService( id:number ) {
    const supabase = createClient();
    const { data, error} = await supabase.from('Service').select('title').eq('serviceid', id);

    if(error){
        return ["error", "error"]
    }
    if (data)
    {
        return data;
    }
}

export async function fetchServices(){
    const supabase = createClient();
    const { data: services } = await supabase.from('Service').select();
    const { data: onetimeServices } = await supabase.from('OnetimeService').select();
    const { data: hourlyServices } = await supabase.from('HourlyService').select();


    const completeServices = services?.map((service : service) => {
        
    const onetimeservice = onetimeServices?.find((ot : service) => ot.serviceid === service.serviceid);
    const hourlyservice = hourlyServices?.find((h : service) => h.serviceid === service.serviceid);

        if(onetimeservice){
            return({
                service,
                onetimeservice,
                serviceType: 'onetime'
            });
        } else {
            return({
                service,
                hourlyservice,
                serviceType: 'hourly'
            });
        }
    });

    return completeServices; 
}
export async function addPeople(
    firstname:string,
    middlename:string,
    lastname:string,
    phonenumber:string,
    emailaddress:string
){
    const supabase = createClient();

    // getting the largest id number from the table
    let largestidnumber;
    
    const { data: people } = await supabase.from('Person').select('personid').order('personid', {ascending:false});
    const peopleArr = Object.keys(people);
    
    const targetPerson = people[peopleArr[0]] // just filter out the first one

    Object.values(targetPerson).forEach((key)=>{
        largestidnumber = key
    })

    largestidnumber = largestidnumber + 1;

    const { error } = await supabase.from('Person').insert({
        personid: largestidnumber,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        contactnumber: parseInt(phonenumber),
        emailaddress: emailaddress,
    })

    if(error)
        return error

    return 2;
    // get the last number in the schedule
}

export async function addCustomer(
    firstname:string,
    middlename:string,
    lastname:string,
    phonenumber:string,
    emailaddress:string,
    isMain:boolean
){
    const supabase = createClient();

    // PUTTING THE main customer TO Person
    // getting the largest id number from the table
    let largestpersonidnumber;
    
    
    const { data: people } = await supabase.from('Person').select('personid').order('personid', {ascending:false});
    const peopleArr = Object.keys(people);
    
    const targetPerson = people[peopleArr[0]] // just filter out the first one

    Object.values(targetPerson).forEach((key)=>{
        largestpersonidnumber = key
    })

    largestpersonidnumber = largestpersonidnumber + 1;

    const { error1 } = await supabase.from('Person').insert({
        personid: largestpersonidnumber,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        contactnumber: parseInt(phonenumber),
        emailaddress: emailaddress,
    })

    let largestcustomeridnumber;
    let latestappointmentid;

    //gettng the next cutomer number
    const { data: customers } = await supabase.from('Customers').select('customerid').order('customerid', {ascending:false});
    const customerArr = Object.keys(customers);
    
    const targetCustomer = customers[customerArr[0]] // just filter out the first one

    Object.values(targetCustomer).forEach((key)=>{
        largestcustomeridnumber = key
    })

    largestcustomeridnumber = largestcustomeridnumber + 1;

    //getting the most recent appointment
    const { data: appointments } = await supabase.from('Appointment').select('appointmentid').order('appointmentid', {ascending:false});
    const appointmentArr = Object.keys(appointments);
    
    const targetAppointment = appointments[appointmentArr[0]] // just filter out the first one

    Object.values(targetAppointment).forEach((key)=>{
        latestappointmentid = key
    })

    const { error2 } = await supabase.from('Customers').insert({
        customerid:largestcustomeridnumber,
        personid: largestpersonidnumber,
        ismain: isMain,
        appointmentid: latestappointmentid
    });

    return error2;
    // get the last number in the schedule
}

export async function addOneAppointment(
    serviceid:string,
    isparkingspotneeded:boolean,
    //status
    //tracking number
    //discount
){
    const supabase = createClient();

    // getting the largest id number from the table
    let largestidnumber;
    
    const { data: appointment } = await supabase.from('Appointment').select('appointmentid').order('appointmentid', {ascending:false});
    const appointmentArr = Object.keys(appointment);
    
    const targetAppointment = appointment[appointmentArr[0]] // just filter out the first one

    Object.values(targetAppointment).forEach((key)=>{
        largestidnumber = key
    })

    largestidnumber = largestidnumber + 1;

    const { error } = await supabase.from('Appointment').insert({
        appointmentid: largestidnumber,
        serviceid:parseInt(serviceid),
        isparkingspotneeded:isparkingspotneeded,
        status:"Pending",
        trackingnumber: "123456",
        discount:15.0
    })

    if(error)
        return error

    return 2;
    // get the last number in the schedule
}

export async function fetchSchedules(){
    const supabase = createClient();

    const {data, error } = await supabase.from('Schedule').select();
    if (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
    return data;
}


/*
export async function addAppointment(req: NextApiRequest, res: NextApiResponse){
    if (req.method === 'POST') {
        const { dates, timeslot1, timeslot2, serviceid, 
            maincustomerfirstname, maincustomermiddlename, 
            maincustomerlastname, needsparking, additionalrequests, 
            additionalCustomers } = req.body;

        const supabase = createClient();

        const person_stored = await findPerson(maincustomerfirstname, maincustomermiddlename, maincustomerlastname, supabase);

        if(person_stored){
            console.log('passed correctly : ', person_stored);
        }
        
        // this adds the data, though im not sure how to add the data yet to the db
        // const { data, error } = await supabase.from('')
        //     .insert([
        //         {
        //             dates,
        //             timeslot1,
        //             timeslot2,
        //             serviceid,
        //             maincustomerfirstname,
        //             maincustomermiddlename,
        //             maincustomerlastname,
        //             needsparking,
        //             additionalrequests,
        //             additionalCustomers
        //         }
        //     ]);

    }
}
    */





