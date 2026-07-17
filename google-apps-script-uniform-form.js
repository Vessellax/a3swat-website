// A3 SWAT Baseball — Uniform Order Form Builder
// ─────────────────────────────────────────────────────────────
// 1. Go to script.google.com → New project
// 2. Delete everything and paste this entire file
// 3. Click Save (floppy disk)
// 4. Click Run (▶) with createUniformForm selected — first run will
//    ask you to authorize (this creates a Form + Sheet in your Drive)
// 5. Click View → Logs (or Ctrl+Enter) to get the edit/live/sheet URLs
// 6. Open the "edit" URL, then use Customize theme (palette icon,
//    top right) to add the A3 SWAT header image and set the theme
//    color to gold (#F5C518) — Apps Script can't set theme/header,
//    that part still needs to be done once in the Forms UI.
//
// Safe to re-run: each run creates a brand-new Form + Sheet, it
// never edits an existing one. Delete the old ones from Drive if
// you re-run this after making changes below.

function createUniformForm() {
  const form = FormApp.create('A3 SWAT Baseball – Fall 2026 Uniform Order Form');
  form.setDescription(
    'Welcome to A3 SWAT Baseball! Please complete this form carefully. All uniforms are custom made, and once orders are submitted, changes cannot be guaranteed. Please verify all sizes before submitting.'
  );
  form.setCollectEmail(false);

  // ── Section 1: Player Information ──────────────────────────
  form.addPageBreakItem().setTitle('Player Information');

  form.addTextItem().setTitle('Player Name').setRequired(true);

  form.addListItem()
    .setTitle('Team')
    .setChoiceValues(['14U', '16U', '18U'])
    .setRequired(true);

  form.addDateItem().setTitle('Player Date of Birth').setRequired(true);

  form.addTextItem().setTitle('Parent/Guardian Name').setRequired(true);
  form.addTextItem().setTitle('Phone Number').setRequired(true);
  form.addTextItem().setTitle('Email Address').setRequired(true);

  // ── Section 2: Jersey Information ──────────────────────────
  form.addPageBreakItem().setTitle('Jersey Information');

  form.addTextItem().setTitle('Preferred Jersey Number (1st Choice)');
  form.addTextItem().setTitle('2nd Choice');
  form.addTextItem().setTitle('3rd Choice');

  // ── Section 3: Jersey Size ──────────────────────────────────
  form.addPageBreakItem().setTitle('Jersey Size');

  form.addMultipleChoiceItem()
    .setTitle('Game Jersey')
    .setChoiceValues([
      'Youth Small', 'Youth Medium', 'Youth Large', 'Youth XL',
      'Adult Small', 'Adult Medium', 'Adult Large', 'Adult XL', 'Adult XXL'
    ])
    .setRequired(true);

  // ── Section 4: Pants ────────────────────────────────────────
  form.addPageBreakItem().setTitle('Pants');

  form.addMultipleChoiceItem()
    .setTitle('Pant Size')
    .setChoiceValues([
      'Youth XS', 'Youth Small', 'Youth Medium', 'Youth Large', 'Youth XL',
      'Adult Small', 'Adult Medium', 'Adult Large', 'Adult XL', 'Adult 2XL'
    ])
    .setRequired(true);

  // ── Section 5: Hat ──────────────────────────────────────────
  form.addPageBreakItem().setTitle('Hat');

  form.addListItem()
    .setTitle('Hat Size')
    .setChoiceValues(['S/M', 'M/L', 'L/XL'])
    .setRequired(true);

  // ── Final Confirmation ──────────────────────────────────────
  form.addPageBreakItem().setTitle('Final Confirmation');

  form.addCheckboxItem()
    .setTitle('Acknowledgment')
    .setChoiceValues([
      'I have reviewed all sizes and understand that uniforms are custom ordered and cannot be exchanged or refunded once production begins.'
    ])
    .setRequired(true);

  // ── Link responses to a new Spreadsheet ─────────────────────
  const ss = SpreadsheetApp.create('A3 SWAT Baseball – Fall 2026 Uniform Orders');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('Edit URL:       ' + form.getEditUrl());
  Logger.log('Live form URL:  ' + form.getPublishedUrl());
  Logger.log('Spreadsheet:    ' + ss.getUrl());
}
