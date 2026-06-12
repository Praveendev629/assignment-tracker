import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Assignment, Student } from '../types';

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

const head = (title: string) => `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#fff;color:#111}
.hdr{text-align:center;border-bottom:3px solid #E53935;padding-bottom:14px;margin-bottom:20px}
.hdr h1{margin:0;color:#E53935;font-size:22px}
.hdr p{margin:4px 0 0;color:#666;font-size:12px}
table{width:100%;border-collapse:collapse}
th{background:#E53935;color:#fff;padding:9px 10px;text-align:left;font-size:12px}
td{padding:8px 10px;font-size:11px;border-bottom:1px solid #eee}
tr:nth-child(even) td{background:#fafafa}
.ftr{text-align:center;margin-top:28px;color:#aaa;font-size:10px}
</style></head><body>
<div class="hdr"><h1>Assignment Tracker</h1><p>${title} &mdash; Generated: ${fmt(new Date().toISOString())}</p></div>`;

export const exportStudentPDF = async (student: Student, assignments: Assignment[]) => {
  const rows = assignments.map(a => `<tr>
    <td>${student.name}${student.initial ? ' '+student.initial : ''}</td>
    <td>${a.subject}</td><td>${a.assignmentTitle}</td><td>${a.marks}</td><td>${fmt(a.submissionDate)}</td>
  </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">No assignments</td></tr>';
  const html = head(`${student.name} — Report`) +
    `<table><thead><tr><th>Student</th><th>Subject</th><th>Assignment</th><th>Marks</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="ftr">Assignment Tracker — Developed by Shiyam</div></body></html>`;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
};

export const exportAllStudentsPDF = async (students: Student[], assignments: Assignment[]) => {
  const rows = assignments.map(a => {
    const s = typeof a.studentId === 'object' ? a.studentId as Student : students.find(st => st._id === a.studentId);
    const n = s ? `${s.name}${s.initial ? ' '+s.initial : ''}` : 'Unknown';
    return `<tr><td>${n}</td><td>${a.subject}</td><td>${a.assignmentTitle}</td><td>${a.marks}</td><td>${fmt(a.submissionDate)}</td></tr>`;
  }).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">No data</td></tr>';
  const html = head('All Students — Report') +
    `<table><thead><tr><th>Student</th><th>Subject</th><th>Assignment</th><th>Marks</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="ftr">Assignment Tracker — Developed by Shiyam</div></body></html>`;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
};

export const exportStudentListPDF = async (students: Student[]) => {
  const rows = students.map(s => `<tr><td>${s.name}</td><td>${s.initial||'—'}</td><td>${s.assignmentCount??0}</td></tr>`).join('')
    || '<tr><td colspan="3" style="text-align:center;color:#999">No students</td></tr>';
  const html = head('Student List') +
    `<table><thead><tr><th>Student Name</th><th>Initial</th><th>Assignment Count</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="ftr">Assignment Tracker — Developed by Shiyam</div></body></html>`;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
};
