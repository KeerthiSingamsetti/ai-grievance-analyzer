import express    from 'express';
import Complaint   from '../models/Complaint.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ── GET all complaints (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

// ── GET stats (admin only)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total    = await Complaint.countDocuments();
    const high     = await Complaint.countDocuments({ overall_priority: 'High' });
    const pending  = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    const deptAgg = await Complaint.aggregate([
      { $unwind: '$departments_to_notify' },
      { $group: { _id: '$departments_to_notify', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyAgg = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id  : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Monthly resolved vs pending (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAgg = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month : { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    // reshape into [{ label:'Jan 26', Resolved:4, Pending:7 }, ...]
    const monthlyMap = {};
    for (const row of monthlyAgg) {
      const m = row._id.month;
      if (!monthlyMap[m]) monthlyMap[m] = { Resolved: 0, Pending: 0 };
      if (row._id.status === 'Resolved') monthlyMap[m].Resolved += row.count;
      else                               monthlyMap[m].Pending  += row.count;
    }
    const byMonth = Object.entries(monthlyMap)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([month, v]) => ({
        label   : new Date(month + '-01').toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
        Resolved: v.Resolved,
        Pending : v.Pending,
      }));

    res.json({
      total, high, pending, resolved,
      byDepartment: deptAgg.map(d => ({ name: d._id, count: d.count })),
      byDay       : dailyAgg.map(d => ({ date: d._id, count: d.count })),
      byMonth,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// ── PUBLIC: track complaint by GRV-XXXX (no auth)
router.get('/track/:complaintId', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId.toUpperCase()
    });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found. Please check your ID.' });
    }
    res.json({
      complaintId          : complaint.complaintId,
      name                 : complaint.name,
      status               : complaint.status,
      overall_priority     : complaint.overall_priority,
      departments_to_notify: complaint.departments_to_notify,
      total_issues         : complaint.total_issues,
      issues               : complaint.issues,
      createdAt            : complaint.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaint' });
  }
});

// ── PATCH mark as resolved (admin only)
router.patch('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { returnDocument: 'after' }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update complaint' });
  }
});

export default router;