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
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${user.name}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        setPosts([]);
      }
    };
    getPosts();
  }, [user]);

  
  if (tickets) {
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
        category: "ticket",
      };
      eventsList.push(event);
    }
  }
  !posts.error &&
    posts?.map((post) => {
      const startDate = post?.startDate?.split("T")[0];
      const endDate = post?.endDate.split("T")[0];
      const event = {
        title: post?.name,
        start: new Date(`${startDate} ${post?.startTime}:00.000+00:00`),
        end: new Date(`${endDate} ${post?.endTime}:00.000+00:00`),
        id: post._id,
        category: "post",
        color: "green",
      };
      eventsList.push(event);
    });

  function handleEventClick(event) {
    let category = event.event._def?.extendedProps.category;
    if (category === "ticket") {
      let ticket = tickets.find(
        (ticket) => ticket._id === event.event._def.publicId
      );
      let selectedEvent = {
        id:ticket._id,
        eventId:ticket.eventid._id,
        event: ticket.ticketDetails.eventname,
        name: ticket.ticketDetails.name,
        price: ticket.ticketDetails.ticketprice,
        start: ticket.ticketDetails.eventdate,
        time: ticket.ticketDetails.eventtime,
        venue: ticket.eventid.venue,
        type: ticket.eventid.eventType,
        img: ticket.eventid.img,
        category: "ticket",
      };
      setSelectedEvent(selectedEvent);
    }
    if (category === "post") {
      let post = posts.find((post) => post._id === event.event._def.publicId);
      let selectedEvent = {
        event: post.name,
        name: user.name,
        price: post.ticketPrice,
        start: post.startDate,
        time: post.startTime,
        venue: post.venue,
        type: post.eventType,
        img: post.img,
        category: "post",
      };
      setSelectedEvent(selectedEvent);
    }

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
  
  return (
    <Box w={"80%"} m={"auto"}>
      {/* <Flex alignItems={"center"} gap={"5"}>
        <Box bg={"blue"} w={"12px"} h={"12px"} borderRadius={"full"}></Box>
        <Text>Tickets</Text>
        <Box bg={"green"} w={"12px"} h={"12px"} borderRadius={"full"}></Box>
        <Text>Posts</Text>
      </Flex> */}

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
        <CreatePost
          date={date}
          createPostOpen={createPostOpen}
          setCreatePostOpen={setCreatePostOpen}
        />
      )}
    </Box>
  );
};

export default CalendarPage;
