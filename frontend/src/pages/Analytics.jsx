import React, { useState, useEffect } from "react";
import axios from "axios";

function Analytics() {
    const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        // Fetch analytics data from backend
        axios.get("http://localhost:5000//api/analytics")
            .then(response => {
                setAnalyticsData(response.data);
            })
            .catch(error => {
                console.error("Error fetching analytics:", error);
            });
    }, []);

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