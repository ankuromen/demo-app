import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';

const Tickets = () => {
  const user = useRecoilValue(userAtom); // Get the user data from Recoil atom
  const [tickets, setTickets] = useState([]);
  console.log(user._id);

  useEffect(() => {
    if (user) {
      // If user data is available, fetch tickets associated with the user
      const fetchTickets = async () => {
        try {
          const response = await axios.get(`/api/tickets/gettickets/${user._id}`); // Changed to user._id
          setTickets(response.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchTickets();
    }
  }, [user]); // Fetch tickets whenever user data changes
  return (
    <div>
      <h2>Your Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>Count</th>
            <th>Event Name</th>
            <th>Event Date</th>
            <th>Event Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket.ticketDetails.name}</td>
              <td>{ticket.ticketDetails.email}</td>
              <td>{ticket.ticketDetails.contactNo}</td>
              <td>{ticket.ticketDetails.count}</td>
              <td>{ticket.ticketDetails.eventname}</td>
              <td>{new Date(ticket.ticketDetails.eventdate).toLocaleDateString()}</td>
              <td>{ticket.ticketDetails.eventtime}</td>
              <td>{ticket.ticketDetails.ticketprice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Tickets;
