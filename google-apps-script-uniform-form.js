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
// 7. To add the Shipping Address section to the live form, select
//    addShippingAddressSection and click Run instead.
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

// ─────────────────────────────────────────────────────────────
// Confirmation message + submit notification email
// ─────────────────────────────────────────────────────────────
// Run once, after createUniformForm() has already made the form.
// Sets a branded thank-you message and emails NOTIFY_EMAILS every
// time someone submits an order. Safe to run more than once — it
// won't create duplicate triggers.

const UNIFORM_FORM_ID = '1v8Tl7PHmZb6laoUjSi1bAp6lz-Fu_2QT5QFQPO2jHf0';
const NOTIFY_EMAILS = ['info@a3swatbaseball.com']; // add the second admin's email here too

function setupUniformFormExtras() {
  const form = FormApp.openById(UNIFORM_FORM_ID);

  form.setConfirmationMessage(
    'Thanks for submitting your uniform order for A3 SWAT Baseball!\n\n' +
    'Your player info, jersey number requests, and sizing have all been recorded. ' +
    'Since every uniform is custom made, please make sure everything above was accurate — ' +
    'changes can\'t be guaranteed once production begins.\n\n' +
    'Questions? Reach out to info@a3swatbaseball.com.'
  );

  const alreadyWired = ScriptApp.getProjectTriggers().some(t =>
    t.getHandlerFunction() === 'onUniformFormSubmit' && t.getTriggerSourceId() === UNIFORM_FORM_ID
  );

  if (!alreadyWired) {
    ScriptApp.newTrigger('onUniformFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
  }

  Logger.log('Confirmation message set. Trigger ' + (alreadyWired ? 'already existed.' : 'created.'));
}

// ─────────────────────────────────────────────────────────────
// Add a Shipping Address section to the existing form
// ─────────────────────────────────────────────────────────────
// Run once. Inserts a new "Shipping Address" page right after
// Player Information and before Jersey Information, on the LIVE
// form (does not create a new form). New questions automatically
// appear as new columns in the linked responses spreadsheet —
// nothing to do there. Safe to re-run: it skips if the section
// already exists.

function addShippingAddressSection() {
  const form = FormApp.openById(UNIFORM_FORM_ID);
  const items = form.getItems();

  const alreadyAdded = items.some(it =>
    it.getType() === FormApp.ItemType.PAGE_BREAK && it.getTitle() === 'Shipping Address'
  );
  if (alreadyAdded) {
    Logger.log('Shipping Address section already exists — skipping.');
    return;
  }

  const insertIndex = items.findIndex(it =>
    it.getType() === FormApp.ItemType.PAGE_BREAK && it.getTitle() === 'Jersey Information'
  );
  if (insertIndex === -1) {
    throw new Error('Could not find "Jersey Information" page break to insert before.');
  }

  const pageBreak = form.addPageBreakItem().setTitle('Shipping Address');
  const street = form.addTextItem().setTitle('Street Address').setRequired(true);
  const aptUnit = form.addTextItem().setTitle('Apt / Unit (optional)').setRequired(false);
  const city = form.addTextItem().setTitle('City').setRequired(true);
  const state = form.addTextItem().setTitle('State').setRequired(true);
  const zip = form.addTextItem().setTitle('ZIP Code').setRequired(true);

  let idx = insertIndex;
  [pageBreak, street, aptUnit, city, state, zip].forEach(item => {
    form.moveItem(item, idx);
    idx++;
  });

  Logger.log('Shipping Address section added.');
}

function onUniformFormSubmit(e) {
  const itemResponses = e.response.getItemResponses();

  const answers = {};
  itemResponses.forEach(ir => { answers[ir.getItem().getTitle()] = ir.getResponse(); });

  const subject = 'New Uniform Order — ' + (answers['Player Name'] || 'Unknown Player') +
                   ' (' + (answers['Team'] || '') + ')';

  const lines = ['A new uniform order was submitted for A3 SWAT Baseball.', ''];
  itemResponses.forEach(ir => {
    lines.push(ir.getItem().getTitle() + ': ' + ir.getResponse());
  });
  lines.push('', 'Submitted: ' + new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));

  MailApp.sendEmail(NOTIFY_EMAILS.join(','), subject, lines.join('\n'));
}
