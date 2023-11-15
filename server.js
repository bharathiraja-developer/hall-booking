const express = require("express");
const app = express();
app.use(express.json());

let rooms = [
  {
    roomId: 1,
    noOfSeats: 100,
    aminites: ["parking", "free wifi", "restaurant"],
    priceFor1hour: 800,
    bookedDetails: [
      {
        customerName: "Person1",
        date: "15-11-2023",
        startTime: "06:00",
        endTime: "21:00",
      },
    ],
  },
  {
    roomId: 2,
    noOfSeats: 200,
    aminites: [
      "parking",
      "free wifi",
      "family rooms",
      "restaurant",
      "room service",
    ],
    priceFor1hour: 1000,
    bookedDetails: [
      {
        customerName: "Person2",
        date: "01-01-2023",
        startTime: "06:00",
        endTime: "21:00",
      },
    ],
  },
  {
    roomId: 3,
    noOfSeats: 250,
    aminites: [
      "parking",
      "free wifi",
      "family rooms",
      "restaurant",
      "room service",
    ],
    priceFor1hour: 1500,
    bookedDetails: [
      {
        customerName: "Person3",
        date: "01-01-2023",
        startTime: "06:00",
        endTime: "21:00",
      },
    ],
  },
];

// Create a room
app.post("/api/room", (request, response) => {
  let roomId = rooms.length + 1;
  rooms = rooms.concat({ roomId: roomId, ...request.body, bookedDetails: [] });
  response.json({ message: "Room created successfully" });
});

// Booking a room
app.patch("/api/room", (request, response) => {
  const id = request.body.roomId;
  const date = request.body.date;
  delete request.body.roomId;
  const bookedRoom = request.body;
  const room = rooms.find((room) => room.roomId == id);
  const detail = room.bookedDetails.find((detail) => detail.date == date);
  if (!detail) {
    rooms = rooms.map((room) =>
      room.roomId == id
        ? { ...room, bookedDetails: [...room.bookedDetails, bookedRoom] }
        : room
    );
    response.json({ message: "Room booked sucessfully" });
  } else response.json({ message: "room is already booked" });
});

// List all the rooms with booked data
app.get("/api/room", (request, response) => {
  let date = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("-");
  let showroom = rooms.map((room) => {
    return {
      roomName: room.roomId,
      bookedStatus:
        date === room.bookedDetails[room.bookedDetails.length - 1].date
          ? "Booked"
          : "NotBooked",
      bookedData: [...room.bookedDetails],
    };
  });
  response.json(showroom);
});

// List all the customers with booked data
app.get("/api/room/customers", (request, response) => {
  let customers = [];
  rooms.forEach((room) => {
    let customer = room.bookedDetails.map((person) => {
      return {
        roomName: room.roomId,
        customerName: person.customerName,
        date: person.date,
        startTime: person.startTime,
        endTime: person.endTime,
      };
    });
    customers.push(...customer);
  });
  response.json(customers);
});

// How many times a customer booked the room
app.get("/api/room/customers/:name", (request, response) => {
  let name = request.params.name;
  let customers = [];
  rooms.forEach((room) => {
    let customer = room.bookedDetails.map((person) => {
      return {
        roomName: room.roomId,
        customerName: person.customerName,
        date: person.date,
        startTime: person.startTime,
        endTime: person.endTime,
      };
    });
    customers.push(...customer);
  });
  let count = 0;
  customers.forEach((customer) => {
    if (customer.customerName === name) count++;
  });
  response.json(`${name} booked a room : ${count} times`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server starts running...");
});
