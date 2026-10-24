import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { validateRecords, isDate } from '../data/schema'
import { searchScholarships } from '../lib/search'
// Synthetic records exist only in tests. Reserved .invalid domains cannot be providers.
const record = { id: 'synthetic-only', name: 'SYNTHETIC Test Award', provider: 'SYNTHETIC Test Provider', informationUrl: 'https://example.invalid', lastVerified: '2026-10-24' }
const verified = { ...record, verificationStatus: 'verified' }
describe('validation', () => {
  it('accepts missing optional fields and reports them', () => { const r = validateRecords([verified], '2026-10-24'); expect(r.valid).toHaveLength(1); expect(r.reports[0].warnings).toContain('deadline unavailable') })
  it('rejects unsafe URLs, impossible dates, unverified and future records', () => {
    for (const change of [{ informationUrl: 'javascript:alert(1)' }, { applicationUrl: 'https://user:pass@example.invalid' }, { deadline: '2026-02-30' }, { verificationStatus: 'pending' }, { lastVerified: '2027-01-01' }, { name: '' }]) expect(validateRecords([{ ...verified, ...change }], '2026-10-24').valid).toHaveLength(0)
    expect(isDate('2024-02-29')).toBe(true)
  })
  it('rejects every duplicate copy and holds expired or stale entries', () => { expect(validateRecords([verified, verified], '2026-10-24').valid).toHaveLength(0); expect(validateRecords([{ ...verified, deadline: '2026-10-23' }], '2026-10-24').valid).toHaveLength(0); expect(validateRecords([{ ...verified, lastVerified: '2025-01-01' }], '2026-10-24').valid).toHaveLength(0) })
})
describe('search and UI', () => {
  it('searches name/provider case-insensitively without mutating data', () => { const data = [record]; expect(searchScholarships(data, ' test PROVIDER ')).toEqual(data); expect(searchScholarships(data, '')).toEqual(data); expect(searchScholarships(data, 'missing')).toEqual([]); expect(data).toHaveLength(1) })
  it('renders the empty public foundation', () => { render(<App />); expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Scholarship Opportunity Finder'); expect(screen.getByText('Verified listings are not available yet')).toBeInTheDocument(); expect(screen.getByRole('navigation')).toBeInTheDocument() })
  it('searches and displays unknown deadline safely', () => { render(<App scholarships={[record]} />); expect(screen.getByText(/Deadline unknown/)).toBeInTheDocument(); expect(screen.getByRole('link', { name: /Official provider information/ })).toHaveAttribute('href', record.informationUrl); fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'absent' } }); expect(screen.getByText('No matching scholarships')).toBeInTheDocument(); expect(screen.getByRole('status')).toHaveTextContent('0 opportunities shown') })
})
