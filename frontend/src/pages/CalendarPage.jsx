import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import { Box, useDisclosure } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventDetails from "../components/EventDetails";
import CreatePost from "../components/CreatePost";

const CalendarPage = () => {
  const user = useRecoilValue(userAtom); // Get The user data from Recoil atom
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [date, setDate] = useState();
  const eventsList = [];
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const {
    isOpen: isEventDetailsOpen,
    onOpen: onEventDetailsOpen,
    onClose: onEventDetailsClose,
  } = useDisclosure();

  useEffect(() => {
    if (user) {
      // If user data is available, fetch tickets associated wiTh The user
      const fetchTickets = async () => {
        try {
          const response = await axios.get(
            `/api/tickets/gettickets/${user._id}`
          ); // Changed to user._id
          setTickets(response.data);
        } catch (error) {
          console.error("Error fetching tickets:", error);
        }
      };
      fetchTickets();
    }
  }, [user]);

  for (const ticket of tickets) {
    const startDate = ticket?.ticketDetails?.eventdate?.split("T")[0];
    const endDate = ticket?.eventid?.endDate?.split("T")[0]; //eventId is populated with event data
    const event = {
      title: ticket?.ticketDetails?.eventname,
      start: new Date(
        `${startDate} ${ticket?.ticketDetails?.eventtime}:00.000+00:00`
      ),
      end: new Date(`${endDate} ${ticket?.eventid?.endTime}:00.000+00:00`),
      id: ticket._id,
    };
    eventsList.push(event);
  }

  function handleEventClick(event) {
    console.log(event.event._def.publicId);
    let selectedEvent = tickets.find(
      (ticket) => ticket._id === event.event._def.publicId
    );
    setSelectedEvent(selectedEvent);
    onEventDetailsOpen();
  }

  function handleDateClick(event) {
    if (user.soloOrganizer === true) {
      setDate(event.dateStr);
      setCreatePostOpen(true);
    } else {
      console.log("Not allowed to edit");
    }
  }

  console.log(createPostOpen);
  return (
    <Box w={"100%"}>
      {eventsList && (
        <FullCalendar
          plugins={[
            interactionPlugin,
            listPlugin,
            dayGridPlugin,
            timeGridPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          selectable={true}
          events={eventsList}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
        />
      )}
      <EventDetails
        selectedEvent={selectedEvent}
        isEventDetailsOpen={isEventDetailsOpen}
        onEventDetailsOpen={onEventDetailsOpen}
        onEventDetailsClose={onEventDetailsClose}
      />
      {user.soloOrganizer === true && (
        <CreatePost date={date} createPostOpen={createPostOpen} setCreatePostOpen={setCreatePostOpen} />
      )}
    </Box>
  );
};

export default CalendarPage;
