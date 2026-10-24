import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
import { fields, required, validateRecords } from '../src/data/schema.ts'
const [input, ...flags] = process.argv.slice(2)
if (!input || flags.some(f => f !== '--write')) throw new Error('Usage: npm run import:data -- path/to/export.csv [--write]')
let headers: string[] = []
const rows = parse(readFileSync(input, 'utf8'), { bom: true, skip_empty_lines: true, columns: (names: string[]) => { headers = names; return names } }) as Record<string, unknown>[]
if (new Set(headers).size !== headers.length) throw new Error('Duplicate CSV headers')
for (const key of [...required, 'verificationStatus']) if (!headers.includes(key)) throw new Error(`Missing column: ${key}`)
for (const key of headers) if (![...fields, 'verificationStatus'].includes(key as typeof fields[number])) throw new Error(`Unknown column: ${key}`)
const { valid, reports } = validateRecords(rows)
mkdirSync('reports', { recursive: true })
const report = [`Input: ${resolve(input)}`, `Accepted: ${valid.length}; rejected: ${rows.length - valid.length}`, ...reports.map(r => `Row ${r.row}: ${r.errors.length ? 'REJECTED ' + r.errors.join('; ') : 'VALID'}${r.warnings.length ? ' | Review: ' + r.warnings.join('; ') : ''}`)].join('\n')
writeFileSync('reports/validation.txt', report + '\n')
writeFileSync('reports/scholarships.candidate.json', JSON.stringify(valid, null, 2) + '\n')
console.log(report)
if (reports.some(r => r.errors.length)) process.exitCode = 1
else if (flags.includes('--write')) writeFileSync('src/data/scholarships.json', JSON.stringify(valid, null, 2) + '\n')
