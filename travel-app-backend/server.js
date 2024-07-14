const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://arvinceramos:2019028512@sysarch.rsjhgni.mongodb.net/sysarch?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const activitySchema = new mongoose.Schema({
  bangkasName: String,
  destination: String,
  date: Date,
  totalPrice: Number
}, { collection: 'activities' });

const Activity = mongoose.model('Activity', activitySchema);

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Activity.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { bangkasName, destination, date, totalPrice } = req.body;
  const newBooking = new Activity({ bangkasName, destination, date, totalPrice });

  try {
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const result = await Activity.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Booking deleted' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
