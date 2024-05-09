import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

function Analytics() {
    const user = useRecoilValue(userAtom); // Get the user data from Recoil atom
    const [analyticsData, setAnalyticsData] = useState([]);

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
        </div>
    );
}

export default Analytics;