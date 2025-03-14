import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;