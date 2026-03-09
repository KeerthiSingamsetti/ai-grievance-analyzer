import nodemailer from 'nodemailer';

// ── Department email map
// Replace these with real department emails when deploying
const DEPT_EMAILS = {
  'Network'        : process.env.EMAIL_NETWORK        || 'network.dept@college.edu',
  'Electrical'     : process.env.EMAIL_ELECTRICAL     || 'electrical.dept@college.edu',
  'Mess'           : process.env.EMAIL_MESS           || 'mess.dept@college.edu',
  'Infrastructure' : process.env.EMAIL_INFRASTRUCTURE || 'infrastructure.dept@college.edu',
  'Academic'       : process.env.EMAIL_ACADEMIC       || 'academic.dept@college.edu',
  'Administration' : process.env.EMAIL_ADMINISTRATION || 'administration.dept@college.edu',
  'General'        : process.env.EMAIL_GENERAL        || 'admin@college.edu',
};

// ── Create transporter (Gmail SMTP)
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,   // Gmail App Password (not your real password)
    },
  });
}

// ── Build HTML email for a department
function buildEmailHTML(complaint, deptName, deptIssues) {
  const priorityColor = complaint.overall_priority === 'High' ? '#b84a20' : '#1a5c36';
  const priorityBg    = complaint.overall_priority === 'High' ? '#fdf0eb' : '#e4f4ec';

  const issuesHTML = deptIssues.map((iss, i) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #ede0d0;font-family:'DM Sans',sans-serif;font-size:14px;color:#2a1508;">#${i + 1}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #ede0d0;font-family:'DM Sans',sans-serif;font-size:14px;color:#2a1508;">${iss.issue}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #ede0d0;font-family:'DM Sans',sans-serif;font-size:14px;color:#5c3d2a;">${iss.category}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #ede0d0;">
        <span style="background:${iss.priority === 'High' ? '#fdf0eb' : '#e4f4ec'};color:${iss.priority === 'High' ? '#b84a20' : '#1a5c36'};padding:3px 9px;border-radius:4px;font-size:12px;font-family:monospace;">${iss.priority}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #ede0d0;">
        <span style="background:${iss.sentiment === 'Negative' ? '#fdf0eb' : '#e4f4ec'};color:${iss.sentiment === 'Negative' ? '#b84a20' : '#1a5c36'};padding:3px 9px;border-radius:4px;font-size:12px;font-family:monospace;">${iss.sentiment}</span>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f3ee;font-family:'DM Sans',Arial,sans-serif;">

  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(42,21,8,0.10);border:1.5px solid #e0cfc0;">

    <!-- Header -->
    <div style="background:#1e0e06;padding:28px 32px;border-bottom:3px solid #b84a20;">
      <div style="font-size:13px;font-family:monospace;letter-spacing:2px;text-transform:uppercase;color:#b84a20;margin-bottom:8px;">🎓 Campus Grievance Portal</div>
      <div style="font-size:24px;font-weight:800;color:#f8f3ee;line-height:1.2;">New Complaint Assigned</div>
      <div style="font-size:14px;color:#8a6050;margin-top:6px;">Department: <strong style="color:#e8c8a8;">${deptName}</strong></div>
    </div>

    <!-- Complaint ID + Priority -->
    <div style="padding:20px 32px;background:#fdf6ee;border-bottom:1.5px solid #e0cfc0;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6550;margin-bottom:5px;">Complaint ID</div>
        <div style="font-family:monospace;font-size:22px;font-weight:700;color:#b84a20;letter-spacing:2px;">${complaint.complaintId}</div>
      </div>
      <div style="background:${priorityBg};color:${priorityColor};padding:8px 18px;border-radius:8px;font-family:monospace;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
        ● ${complaint.overall_priority} Priority
      </div>
    </div>

    <!-- Student Info -->
    <div style="padding:24px 32px;border-bottom:1.5px solid #ede0d0;">
      <div style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a6550;margin-bottom:14px;">Student Details</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#8a6550;width:120px;">Name</td>
          <td style="padding:6px 0;font-size:15px;font-weight:700;color:#2a1508;">${complaint.name}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#8a6550;">Student ID</td>
          <td style="padding:6px 0;font-size:14px;font-family:monospace;font-weight:600;color:#2a1508;">${complaint.roll_no}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#8a6550;">Submitted</td>
          <td style="padding:6px 0;font-size:14px;font-family:monospace;color:#5c3d2a;">${new Date(complaint.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
        </tr>
      </table>
    </div>

    <!-- Complaint Title + Description -->
    <div style="padding:24px 32px;border-bottom:1.5px solid #ede0d0;">
      <div style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a6550;margin-bottom:10px;">Complaint</div>
      ${complaint.complaint_title ? `<div style="font-size:18px;font-weight:800;color:#2a1508;margin-bottom:10px;">${complaint.complaint_title}</div>` : ''}
      <div style="font-size:15px;color:#3a2010;line-height:1.75;background:#f8f3ee;border:1px solid #e0cfc0;border-radius:9px;padding:14px 16px;">${complaint.complaint_text}</div>
    </div>

    <!-- Issues for this dept -->
    <div style="padding:24px 32px;border-bottom:1.5px solid #ede0d0;">
      <div style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a6550;margin-bottom:14px;">Issues Assigned to ${deptName} · ${deptIssues.length}</div>
      <table style="width:100%;border-collapse:collapse;background:#f8f3ee;border-radius:9px;overflow:hidden;border:1px solid #e0cfc0;">
        <thead>
          <tr style="background:#1e0e06;">
            <th style="padding:10px 14px;text-align:left;font-family:monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c09070;">#</th>
            <th style="padding:10px 14px;text-align:left;font-family:monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c09070;">Issue</th>
            <th style="padding:10px 14px;text-align:left;font-family:monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c09070;">Category</th>
            <th style="padding:10px 14px;text-align:left;font-family:monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c09070;">Priority</th>
            <th style="padding:10px 14px;text-align:left;font-family:monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c09070;">Sentiment</th>
          </tr>
        </thead>
        <tbody>${issuesHTML}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f8f3ee;display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:12px;color:#b89080;font-family:monospace;">This is an automated notification from the Campus Grievance Portal.</div>
      <div style="font-size:12px;color:#b89080;font-family:monospace;">${complaint.complaintId}</div>
    </div>

  </div>

</body>
</html>
  `;
}

// ── Main function: send emails to all relevant departments
export async function sendDepartmentEmails(complaint, issues, departments) {
  // Skip if email not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured — skipping notifications');
    return;
  }

  const transporter = createTransporter();

  // Send one email per department
  const emailPromises = departments.map(async (deptName) => {
    const recipientEmail = DEPT_EMAILS[deptName];
    if (!recipientEmail) {
      console.log(`⚠️  No email configured for dept: ${deptName}`);
      return;
    }

    // Filter issues relevant to this department
    const deptIssues = issues.filter(iss =>
      iss.category.toLowerCase().includes(deptName.toLowerCase()) ||
      deptName.toLowerCase().includes(iss.category.toLowerCase()) ||
      issues.length === 1  // if only 1 issue, assign to the dept
    );

    // Fallback — if no issues match by category, show all issues
    const issuesToShow = deptIssues.length > 0 ? deptIssues : issues;

    const mailOptions = {
      from    : `"Campus Grievance Portal" <${process.env.EMAIL_USER}>`,
      to      : recipientEmail,
      subject : `[${complaint.overall_priority} Priority] New Complaint ${complaint.complaintId} — ${complaint.complaint_title || 'Student Grievance'}`,
      html    : buildEmailHTML(complaint, deptName, issuesToShow),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${deptName} (${recipientEmail})`);
    } catch (err) {
      // Email failure should NOT crash the server — just log it
      console.error(`❌ Failed to send email to ${deptName}:`, err.message);
    }
  });

  // Send all emails in parallel
  await Promise.allSettled(emailPromises);
}