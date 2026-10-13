// A3 SWAT Baseball — Spring 2026 Registration Logger + Email Notifier
// ─────────────────────────────────────────────────────────────
// This is a STANDALONE script for a brand-new, dedicated Google Sheet —
// separate from the shared donations/inquiry spreadsheet.
//
// Setup:
// 1. Create a new Google Sheet (e.g. "A3 SWAT Spring 2026 Registrations")
// 2. Extensions → Apps Script
// 3. Delete everything and paste this entire file
// 4. Click Save (floppy disk)
// 5. Deploy → New deployment → Web App
//      Execute as: Me
//      Who has access: Anyone
// 6. Click Deploy → copy the URL → send it to Claude to paste into
//    main.js as REGISTRATION_SHEETS_URL

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
        GmailApp.sendEmail(d.parentEmail, confirmSubject, confirmBody);
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
