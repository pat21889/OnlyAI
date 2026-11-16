// Mock data seeder
//   npm run seed          -> clear collections, then insert mock data
//   npm run seed:destroy  -> clear collections only
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "config/config.env") });

const User = require("./models/User");
const Facility = require("./models/Facility");
const Booking = require("./models/Booking");

const users = [
  { name: "Admin", email: "admin@example.com", tel: "0800000000", role: "admin", password: "admin123" },
  { name: "Somchai Jaidee", email: "somchai@example.com", tel: "0811111111", password: "member123" },
  { name: "Suda Rakdee", email: "suda@example.com", tel: "0822222222", password: "member123" },
  { name: "John Smith", email: "john@example.com", tel: "0833333333", password: "member123" },
];

const facilities = [
  { name: "Football Field A", sportType: "Football", location: "Building 1, Ground Floor", capacity: 22, hourlyRate: 1200 },
  { name: "Badminton Court 1", sportType: "Badminton", location: "Sports Hall, 2nd Floor", capacity: 4, hourlyRate: 200 },
  { name: "Badminton Court 2", sportType: "Badminton", location: "Sports Hall, 2nd Floor", capacity: 4, hourlyRate: 200 },
  { name: "Basketball Court", sportType: "Basketball", location: "Outdoor Zone B", capacity: 10, hourlyRate: 500 },
  { name: "Tennis Court", sportType: "Tennis", location: "Outdoor Zone C", capacity: 4, hourlyRate: 400 },
  { name: "Swimming Pool Lane 1", sportType: "Swimming", location: "Aquatic Center", capacity: 6, hourlyRate: 150 },
  { name: "Futsal Court (Closed)", sportType: "Futsal", location: "Building 3", capacity: 10, hourlyRate: 800, isActive: false },
];

// Date N days from today at 00:00 UTC (same format the controller stores)
const daysFromToday = (n) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
};

const toBooking = (facility, user, dayOffset, startTime, durationHours) => {
  const [h, m] = startTime.split(":").map(Number);
  const startMinutes = h * 60 + m;
  return {
    facility: facility._id,
    user: user._id,
    bookingDate: daysFromToday(dayOffset),
    startTime,
    durationHours,
    startMinutes,
    endMinutes: startMinutes + durationHours * 60,
  };
};

const importData = async () => {
  // User.create runs the pre-save hook so passwords get hashed
  const [, somchai, suda, john] = await User.create(users);
  const [football, badminton1, badminton2, basketball, tennis, pool] = await Facility.create(facilities);

  await Booking.create([
    toBooking(football, somchai, 1, "18:00", 2),
    toBooking(badminton1, suda, 1, "18:00", 1),
    toBooking(badminton2, john, 1, "19:00", 1.5),
    toBooking(basketball, somchai, 2, "16:00", 1),
    toBooking(tennis, suda, 2, "07:00", 2),
    toBooking(pool, john, 3, "06:30", 1),
    toBooking(football, john, 3, "17:00", 2),
    toBooking(badminton1, somchai, 5, "20:00", 1),
  ]);

  console.log("Mock data imported");
  console.log("  admin  : admin@example.com / admin123");
  console.log("  member : somchai@example.com, suda@example.com, john@example.com / member123");
};

const destroyData = async () => {
  await Booking.deleteMany();
  await Facility.deleteMany();
  await User.deleteMany();
  console.log("All users, facilities and bookings deleted");
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await destroyData();
    if (process.argv[2] !== "-d") await importData();
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err.message);
    process.exit(1);
  }
})();
