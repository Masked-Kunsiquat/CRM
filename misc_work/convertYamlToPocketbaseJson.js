import fs from 'fs';
import yaml from 'js-yaml';

const INPUT_FILE = 'audits.yml'; // your YAML file
const OUTPUT_FILE = 'pocketbase_audits.json';

function toISO(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) throw new Error(`Invalid date: ${dateStr}`);
  return date.toISOString(); // converts to format PocketBase needs
}

function loadYamlAndConvert() {
  const raw = fs.readFileSync(INPUT_FILE, 'utf8');
  const parsed = yaml.load(raw);

  const allAudits = [];

  parsed.accounts.forEach(account => {
    const accountId = account.id;

    account.audits.forEach(audit => {
      const record = {
        account: accountId,
        date: toISO(audit.date),
        status: audit.status || 'scheduled',
        note: audit.note || '',
        visited_floors: JSON.stringify(audit.visited_floors || []),
        score: audit.score === null ? null : audit.score
      };

      allAudits.push(record);
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allAudits, null, 2));
  console.log(`✅ Converted ${allAudits.length} audits and saved to ${OUTPUT_FILE}`);
}

loadYamlAndConvert();
