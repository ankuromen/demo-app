import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import emailjs from '@emailjs/browser';

function Analytics() {
    const user = useRecoilValue(userAtom); // Get the user data from Recoil atom
    const [analyticsData, setAnalyticsData] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Your EmailJS service ID, template ID, and Public Key
      const serviceId = 'service_dervv1i';
      const templateId = 'template_dv5m6kd';
      const publicKey = '8-iwSPmr0rEN2bjB9';
  
      // Create a new object that contains dynamic template params
      const templateParams = {
        from_name: name,
        from_email: email,
        to_name: 'Ankur',
        message: message,
      };
  
      // Send the email using EmailJS
      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
          console.log('Email sent successfully!', response);
          setName('');
          setEmail('');
          setMessage('');
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
    }

    useEffect(() => {
        if (user) {
            // Fetch analytics data from backend using the user's ID
            axios.get(`/api/analytics/${user._id}`)
                .then(response => {
                    setAnalyticsData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching analytics:", error);
                });
        }
    }, [user]); // Fetch analytics data whenever user data changes

    return (
        <div>
            <h2>Event Analytics</h2>
            <table>
                <thead>
                    <tr>
                        <th>Event ID</th>
                        <th>Total Tickets</th>
                    </tr>
                </thead>
                <tbody>
                    {analyticsData.map(event => (
                        <tr key={event.eventid}>
                            <td>{event.eventid}</td>
                            <td>{event.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleSubmit} className='emailForm'>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    cols="30"
                    rows="10"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                >
                </textarea>
                <button type="submit">Send Email</button>
            </form>
        </div>
    );
}

export default Analytics;