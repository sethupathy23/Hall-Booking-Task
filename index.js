import * as dotenv from "dotenv";
dotenv.config();
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";

// const express = require("express");
const app = express();
// console.log(process.env.MONGO_URL);
app.use(express.json());
const PORT = 4004;
//mongo connection start
// const MONGO_URL = "mongodb://127.0.0.1:27017";
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
//mongo connection end

//http://localhost:4004
var home =
  "Hello all , Welcome to the HallBooking API, 1) For Hall Data = http://localhost:4004/sampledata , 2) For Hall Details by ID = http://localhost:4004/sampledata/1 (OR) http://localhost:4004/sampledata/2 (OR) http://localhost:4004/sampledata/3 (OR) http://localhost:4004/sampledata/4 (OR) http://localhost:4004/sampledata/5  3) For rooms with booked data = http://localhost:4004/booked  , 4) Remaining Rooms = http://localhost:4004/notbooked  ";
// app.get("/home", async function (requeat, response) {});
app.get("/", function (request, response) {
  response.send(home);
});

//http://localhost:4004/sampledata
// const sampledata = [
//   {
//     id: "1",
//     noOfSeats: "100",
//     amenities: ["Ac", "Chairs"],
//     price: "1000rs/hr",
//     customerName: "",
//     ifBooked: "false",
//     date: "",
//     startTime: "",
//     endTime: "",
//     roomId: "100",
//     roomName: "duplex",
//     bookingStatus: "not booked",
//   },
//   {
//     id: "2",
//     noOfSeats: "1000",
//     amenities: ["Ac", "Chairs", "Decoration", "Triple Cot Room"],
//     price: "5000rs/hr",
//     customerName: "Prasanth",
//     ifBooked: "true",
//     date: "05.09.2023",
//     startTime: "12PM",
//     endTime: "12PM",
//     roomId: "103",
//     roomName: "Suit Room",
//     bookingStatus: "booked",
//   },
//   {
//     id: "3",
//     noOfSeats: "500",
//     amenities: ["Ac", "Chairs", "Decoration", "Double Cot Room"],
//     price: "3000rs/hr",
//     customerName: "",
//     ifBooked: "false",
//     date: "",
//     startTime: "",
//     endTime: "",
//     roomId: "101",
//     roomName: "Duplex",
//     bookingStatus: "not booked",
//   },
//   {
//     id: "4",
//     noOfSeats: "200",
//     amenities: ["Ac", "Chairs", "Double Cot Room"],
//     price: "1500rs/hr",
//     customerName: "Prakash",
//     ifBooked: "true",
//     date: "15.09.2023",
//     startTime: "12pm",
//     endTime: "12pm",
//     roomId: "102",
//     roomName: "AC-Normal",
//     bookingStatus: "booked",
//   },
//   {
//     id: "5",
//     noOfSeats: "100",
//     amenities: ["Non-AC", "Chairs"],
//     price: "2500rs/hr",
//     customerName: "Karthik",
//     ifBooked: "true",
//     date: "25.09.2023",
//     startTime: "11Am",
//     endTime: "12PM",
//     roomId: "104",
//     roomName: "Non-AC Normal",
//     bookingStatus: "booked",
//   },
// ];

app.get("/sampledata", async function (request, response) {
  //db.sampledata.find({})
  const sampledata = await client
    .db("HallBooking")
    .collection("hallbooking")
    .find({})
    .toArray();
  response.send(sampledata);
});

//http://localhost:4004/sampledata
app.post("/sampledata", async function (request, response) {
  const datas = request.body;
  //db.sampledata.insertMany(datas);
  const data = await client
    .db("HallBooking")
    .collection("hallbooking")
    .insertMany(datas);
  console.log(data);
  response.send(data);
});

//http://localhost:4004/sampledata/1
app.get("/sampledata/:id", async function (request, response) {
  const { id } = request.params;
  console.log(id);
  //db.sampledata.findOne({id:"1"})
  const data = await client
    .db("HallBooking")
    .collection("hallbooking")
    .findOne({ id: id });
  console.log(data);
  data
    ? response.send(data)
    : response.status(404).send({ message: "Your Data Is Not Found" });
});

//delete
app.delete("/sampledata/:id", async function (request, response) {
  const { id } = request.params;
  console.log(id);
  //db.sampledata.deleteOne({id:"1"})
  const result = await client
    .db("HallBooking")
    .collection("hallbooking")
    .deleteOne({ id: id });
  console.log(result);
  result.deletedCount >= 1
    ? response.send({ message: "Data Is Successfully Deleted" })
    : response.status(404).send({ message: "Your Data Is Not Found" });
});

//update
// app.put("/sampledata/:id", async function (request, response) {
//   const { id } = request.params;
//   console.log(id);
//   //db.sampledata.updateOne({id:id} , {$set: data})
//   const result = await client
//     .db("HallBooking")
//     .collection("hallbooking")
//     .updateOne({ id: id } , {$set: data});
//     response.send(result);
// });

//http://localhost:4004/sampledata/booked
// app.put("/sampledata/booked/:id", async function (request, response) {
//   //If Hall Booking= "true"//
//   const { id } = request.params;
//   const data = request.body;
//   const result = await client
//     .db("HallBooking")
//     .collection("hallbooking")
//     .findOne({ _id: new ObjectId(id) });
//   console.log(result);
//   if (hall.ifBooked === "true") {
//     response.send({ message: "Hall already booked" });
//   } else {
//     const result1 = await client
//       .db("HallBooking")
//       .collection("hallbooking")
//       .updateOne({ _id: new ObjectId(id) }, { $set: data });
//     response.send(result1);
//   }
// });

app.get("/booked", async function (request, response) {
  const result = await client
    .db("HallBooking")
    .collection("hallbooking")
    .find({ ifBooked: "true" })
    .project({
      id: 1,
      roomName: 1,
    })
    .toArray();
  response.send(result);
});
//http://localhost:4004/booked

//remaining rooms
app.get("/notbooked", async function (request, response) {
  const result = await client
    .db("HallBooking")
    .collection("hallbooking")
    .find({ ifBooked: "false" })
    .project({
      _id: 0,
      roomName: 1,
      roomId: 1,
    })
    .toArray();
  response.send(result);
});
//http://localhost:4004/notbooked

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
