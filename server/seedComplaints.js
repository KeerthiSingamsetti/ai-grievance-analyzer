// ── DEMO SEED SCRIPT
// Inserts pre-built demo complaints directly into MongoDB
// Run once: node seedComplaints.js
//
// Usage:
//   cd server
//   node seedComplaints.js
//
// To clear existing complaints first:
//   node seedComplaints.js --clear

import 'dotenv/config';
import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';

const CLEAR = process.argv.includes('--clear');

const demoComplaints = [

  // ─── HIGH PRIORITY ───────────────────────────────────────────

  {
    complaintId          : 'GRV-1001',
    name                 : 'Arjun Sharma',
    roll_no              : '22BCE1047',
    complaint_title      : 'Multiple Issues in Hostel Block A',
    complaint_text       : 'The WiFi in Block A has not been working for the past 3 days and I am unable to attend online classes. The lights in corridor 3 are completely broken since last week which is very dangerous at night. The mess food quality has been very poor this week and yesterday insects were found in the food. Please resolve all these urgently.',
    issues: [
      { issue: 'WiFi in Block A has not been working for the past 3 days', category: 'Network',       sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Lights in corridor 3 are completely broken since last week', category: 'Electrical',  sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Insects were found in the mess food',                        category: 'Mess',         sentiment: 'NEGATIVE', priority: 'High' },
    ],
    departments_to_notify: ['Network', 'Electrical', 'Mess'],
    overall_priority     : 'High',
    total_issues         : 3,
    status               : 'Pending',
    createdAt            : new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },

  {
    complaintId          : 'GRV-1002',
    name                 : 'Priya Nair',
    roll_no              : '21CSE2089',
    complaint_title      : 'Internal Marks Not Updated on Portal',
    complaint_text       : 'My internal assessment marks for Data Structures have not been updated on the portal for 2 months despite submitting all assignments. The professor is not responding to emails. My mid semester paper was evaluated unfairly and this is badly affecting my GPA.',
    issues: [
      { issue: 'Internal assessment marks not updated for 2 months',    category: 'Academic', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Professor not responding to emails',                     category: 'Academic', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Mid semester paper evaluated unfairly affecting GPA',   category: 'Academic', sentiment: 'NEGATIVE', priority: 'High' },
    ],
    departments_to_notify: ['Academic'],
    overall_priority     : 'High',
    total_issues         : 3,
    status               : 'Pending',
    createdAt            : new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1003',
    name                 : 'Rahul Verma',
    roll_no              : '22ME3056',
    complaint_title      : 'Broken Furniture and Power Failure in Lab',
    complaint_text       : 'The computer lab on 3rd floor has 8 broken chairs and damaged desks that have not been replaced for months. Students are forced to stand during practicals. The UPS and power backup in the lab stopped working and whenever there is a power cut all student work is lost.',
    issues: [
      { issue: 'Broken chairs and damaged desks in computer lab',       category: 'Infrastructure', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'UPS and power backup stopped working in lab',           category: 'Electrical',     sentiment: 'NEGATIVE', priority: 'High' },
    ],
    departments_to_notify: ['Infrastructure', 'Electrical'],
    overall_priority     : 'High',
    total_issues         : 2,
    status               : 'Resolved',
    createdAt            : new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1004',
    name                 : 'Sneha Reddy',
    roll_no              : '21ECE4023',
    complaint_title      : 'Poor Food Quality and Hygiene in Mess',
    complaint_text       : 'The mess food quality has been extremely poor this week. Stale food is being served and cockroaches were found in the kitchen yesterday. The utensils are dirty and the staff is not wearing gloves while cooking. Many students have fallen sick due to the food.',
    issues: [
      { issue: 'Stale food being served in mess',                       category: 'Mess', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Cockroaches found in mess kitchen',                     category: 'Mess', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Students falling sick due to unhygienic mess food',     category: 'Mess', sentiment: 'NEGATIVE', priority: 'High' },
    ],
    departments_to_notify: ['Mess'],
    overall_priority     : 'High',
    total_issues         : 3,
    status               : 'Resolved',
    createdAt            : new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1005',
    name                 : 'Karthik Menon',
    roll_no              : '22IT5034',
    complaint_title      : 'Scholarship Application Not Processed',
    complaint_text       : 'I submitted my scholarship application 3 months ago but it has not been processed yet. The admin office is not responding to my emails or calls. My bonafide certificate request from 2 months ago has also not been issued. This is causing serious financial difficulty.',
    issues: [
      { issue: 'Scholarship application not processed for 3 months',   category: 'Administration', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Bonafide certificate not issued for 2 months',         category: 'Administration', sentiment: 'NEGATIVE', priority: 'High' },
    ],
    departments_to_notify: ['Administration'],
    overall_priority     : 'High',
    total_issues         : 2,
    status               : 'Pending',
    createdAt            : new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1006',
    name                 : 'Divya Krishnan',
    roll_no              : '21ME6078',
    complaint_title      : 'Water Leakage and Broken Facilities in Hostel',
    complaint_text       : 'There is severe water leakage from the ceiling in room 204 of girls hostel since last week. The bathroom tap is completely broken and there has been no water supply in our wing for 2 days. The hostel room door lock is also broken and we feel unsafe.',
    issues: [
      { issue: 'Severe water leakage from ceiling in room 204',        category: 'Infrastructure', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'No water supply in hostel wing for 2 days',            category: 'Infrastructure', sentiment: 'NEGATIVE', priority: 'High' },
      { issue: 'Hostel room door lock broken feeling unsafe',          category: 'Infrastructure', sentiment: 'NEGATIVE', priority: 'High' },
    ],
    departments_to_notify: ['Infrastructure'],
    overall_priority     : 'High',
    total_issues         : 3,
    status               : 'Resolved',
    createdAt            : new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },

  // ─── LOW PRIORITY ────────────────────────────────────────────

  {
    complaintId          : 'GRV-1007',
    name                 : 'Ananya Iyer',
    roll_no              : '22BCE3012',
    complaint_title      : 'Mess Menu Variety Feedback',
    complaint_text       : 'The mess food is generally okay but the menu has been repetitive for the past few days. It would be nice if some variety is added occasionally. The breakfast timing is also slightly delayed on weekends. This is just a suggestion and not urgent.',
    issues: [
      { issue: 'Mess menu repetitive could use more variety',          category: 'Mess', sentiment: 'NEGATIVE', priority: 'Low' },
    ],
    departments_to_notify: ['Mess'],
    overall_priority     : 'Low',
    total_issues         : 1,
    status               : 'Resolved',
    createdAt            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1008',
    name                 : 'Rohan Das',
    roll_no              : '21ME4056',
    complaint_title      : 'Minor Maintenance Request in Hostel',
    complaint_text       : 'There is a small crack in the wall of the hostel common room. Also one of the garden benches near Block B is slightly broken. Kindly look into this when convenient. Nothing urgent just routine maintenance.',
    issues: [
      { issue: 'Small crack in wall of hostel common room',            category: 'Infrastructure', sentiment: 'NEGATIVE', priority: 'Low' },
      { issue: 'Garden bench near Block B slightly broken',            category: 'Infrastructure', sentiment: 'NEGATIVE', priority: 'Low' },
    ],
    departments_to_notify: ['Infrastructure'],
    overall_priority     : 'Low',
    total_issues         : 2,
    status               : 'Pending',
    createdAt            : new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1009',
    name                 : 'Meera Pillai',
    roll_no              : '22CSE5078',
    complaint_title      : 'WiFi Speed Improvement Request',
    complaint_text       : 'The wifi works fine most of the time but occasionally the speed drops a little during evening hours. This is just a minor observation. Please consider upgrading the router in Block D when possible. Not urgent at all.',
    issues: [
      { issue: 'WiFi speed occasionally drops during evening hours',   category: 'Network', sentiment: 'NEGATIVE', priority: 'Low' },
    ],
    departments_to_notify: ['Network'],
    overall_priority     : 'Low',
    total_issues         : 1,
    status               : 'Pending',
    createdAt            : new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },

  {
    complaintId          : 'GRV-1010',
    name                 :'Pooja Sharma',
    roll_no              : '22IT6045',
    complaint_title      : 'Library Timing Extension Request',
    complaint_text       : 'The library facilities are good overall. I wanted to suggest extending the library hours by one hour on weekdays if possible. Also it would be helpful to add a few more computers in the reading room. This is just feedback and can be addressed whenever convenient.',
    issues: [
      { issue: 'Library hours could be extended on weekdays',          category: 'Administration', sentiment: 'NEGATIVE', priority: 'Low' },
    ],
    departments_to_notify: ['Administration'],
    overall_priority     : 'Low',
    total_issues         : 1,
    status               : 'Resolved',
    createdAt            : new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },

];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    if (CLEAR) {
      await Complaint.deleteMany({});
      console.log('🗑️  Cleared all existing complaints');
    }

    await Complaint.insertMany(demoComplaints);
    console.log(`✅ Inserted ${demoComplaints.length} demo complaints!`);

    // Summary
    const total    = await Complaint.countDocuments();
    const high     = await Complaint.countDocuments({ overall_priority: 'High' });
    const low      = await Complaint.countDocuments({ overall_priority: 'Low' });
    const pending  = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    console.log(`\n📊 DB Summary:`);
    console.log(`   Total: ${total} | High: ${high} | Low: ${low} | Pending: ${pending} | Resolved: ${resolved}`);

    await mongoose.disconnect();
    console.log('\n🎉 Done! Open your admin dashboard to see all complaints.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();