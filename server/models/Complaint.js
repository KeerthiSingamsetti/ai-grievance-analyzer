import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  issue    : String,
  category : String,
  sentiment: String,
  priority : String,
});

const ComplaintSchema = new mongoose.Schema({
  complaintId          : { type: String, required: true, unique: true },
  name                 : { type: String, required: true },
  roll_no              : { type: String, required: true },
  complaint_title      : { type: String, default: '' },      // ← NEW
  complaint_text       : { type: String, required: true },
  issues               : [IssueSchema],
  departments_to_notify: [String],
  overall_priority     : { type: String, default: 'Low' },
  total_issues         : { type: Number, default: 0 },
  status               : { type: String, default: 'Pending' },
  createdAt            : { type: Date,   default: Date.now },
});

export default mongoose.model('Complaint', ComplaintSchema);