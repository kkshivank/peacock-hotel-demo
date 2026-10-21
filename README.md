# The Peacock — Hotel Booking Demo

A clickable prototype of a boutique hotel booking app, built as a single static page. Made to walk a client through the full flow without any backend or API keys.

## What it shows

**Guest side**
- Pick check-in / check-out dates — rooms update to show what's free for those dates.
- Reserve an available room, enter guest details, and pay through a Razorpay-style test checkout.
- Get a confirmation with a booking reference.

**Front desk (admin)**
- Live stats: bookings, revenue, rooms free tonight.
- Bookings list with the source channel for each booking; cancel a booking to free the room.
- Rooms: add, edit, delete, and set status (ready / cleaning / maintenance).
- Channels: a shared inventory pool across Direct, MakeMyTrip, Booking.com and Goibibo. Simulate an incoming OTA booking and watch every channel's availability drop together — the overbooking guard in action.

## How availability works

A room is not a simple available/unavailable flag — it is free *for a date range*. A room is treated as booked when any active booking overlaps the requested range:

```
existing.checkIn < requested.checkOut && existing.checkOut > requested.checkIn
```

## Notes

- All data lives in the browser (localStorage), so bookings persist on reload. "Reset demo data" restores the sample set.
- Payments are simulated — no real money and no payment gateway is called.
- Room images are stylised illustrations; swap in real photos for a client build.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000
