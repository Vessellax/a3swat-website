// A3 SWAT Baseball — Registration Logger + Email Notifier
// ─────────────────────────────────────────────────────────────
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Delete everything and paste this entire file
// 3. Click Save (floppy disk)
// 4. Deploy → New deployment → Web App
//      Execute as: Me
//      Who has access: Anyone
// 5. Click Deploy → copy the URL → paste into main.js line 3

const NOTIFY_EMAIL = 'info@a3swatbaseball.com';

const HEADERS = [
  'Timestamp',
  'Parent Name',
  'Parent Phone',
  'Parent Email',
  'Player Name',
  'Player Birthday',
  'Age Group',
  'High School',
  'Primary Position',
  'Secondary Position',
  'Additional Info'
];

function doGet(e) {
  try {
    const d = e.parameter;
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

    // ── Inquiry (homepage contact form) ──────────────────────
    if (d.type === 'inquiry') {
      const subject = 'New Inquiry — ' + (d.firstName || '') + ' ' + (d.lastName || '');
      const body = [
        'A new inquiry was submitted on a3swatbaseball.com.',
        '',
        'Name:      ' + (d.firstName || '—') + ' ' + (d.lastName || '—'),
        'Email:     ' + (d.email    || '—'),
        'Phone:     ' + (d.phone    || '—'),
        'Age Group: ' + (d.ageGroup || '—'),
        '',
        'Submitted: ' + timestamp
      ].join('\n');

      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── Registration (registration form) ─────────────────────
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#F5C518');
    }

    sheet.appendRow([
      timestamp,
      d.parentName     || '',
      d.parentPhone    || '',
      d.parentEmail    || '',
      d.playerName     || '',
      d.playerBirthday || '',
      d.ageGroup       || '',
      d.highSchool     || '',
      d.position1      || '',
      d.position2      || '',
      d.additional     || ''
    ]);

    // ── Confirmation email to parent ───────────────────────
    let confirmStatus = 'SKIPPED — no parent email on submission';
    if (d.parentEmail) {
      const confirmSubject = 'A3 SWAT Baseball — Registration Received';
      const confirmBody = [
        'Hello ' + (d.parentName || 'there') + ',',
        '',
        'Thank you for registering ' + (d.playerName || 'your athlete') + ' with A3 SWAT Baseball.',
        '',
        'We\'ve received your submission for the ' + (d.ageGroup || '') + ' division and our staff will review it shortly. You can expect to hear from us within 48 hours with next steps.',
        '',
        'We appreciate your interest in A3 SWAT Baseball and look forward to connecting with you.',
        '',
        'Best regards,',
        'A3 SWAT Baseball'
      ].join('\n');

      try {
        MailApp.sendEmail(d.parentEmail, confirmSubject, confirmBody);
        confirmStatus = 'SENT to ' + d.parentEmail;
      } catch (confirmErr) {
        confirmStatus = 'FAILED for ' + d.parentEmail + ' — ' + confirmErr.toString();
      }
    }

    const subject = 'New Registration — ' + (d.playerName || 'Unknown Player') + ' (' + (d.ageGroup || '') + ')';
    const body = [
      'A new registration was submitted on a3swatbaseball.com.',
      '',
      '── PARENT INFORMATION ──────────────────',
      'Name:    ' + (d.parentName  || '—'),
      'Phone:   ' + (d.parentPhone || '—'),
      'Email:   ' + (d.parentEmail || '—'),
      '',
      '── PLAYER INFORMATION ──────────────────',
      'Name:      ' + (d.playerName     || '—'),
      'Birthday:  ' + (d.playerBirthday || '—'),
      'Age Group: ' + (d.ageGroup       || '—'),
      'School:    ' + (d.highSchool     || '—'),
      'Position 1:' + (d.position1      || '—'),
      'Position 2:' + (d.position2      || '—'),
      '',
      '── ADDITIONAL INFO ─────────────────────',
      (d.additional || 'None provided'),
      '',
      '── CONFIRMATION EMAIL ───────────────────',
      confirmStatus,
      '',
      'Submitted: ' + timestamp
    ].join('\n');

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
