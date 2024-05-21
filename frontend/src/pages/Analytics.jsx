import React, { useState } from "react";


import emailjs from '@emailjs/browser';
import { FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";

function Analytics() {


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



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                        cols="30"
                        rows="10"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </FormControl>
                <Button type="submit">Send Email</Button>
            </form>
        </div>
    );
}

export default Analytics;