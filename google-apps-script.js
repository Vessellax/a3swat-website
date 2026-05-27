// A3 SWAT Baseball — Registration Logger
// ─────────────────────────────────────────────────────────────
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Delete everything and paste this entire file
// 3. Click Save (floppy disk)
// 4. Deploy → New deployment → Web App
//      Execute as: Me
//      Who has access: Anyone
// 5. Click Deploy → copy the URL → paste into main.js line 3

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

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
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

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
