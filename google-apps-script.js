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
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write bold gold headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#F5C518');
    }

    const d = e.parameter;

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

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

    // Send email notification
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
