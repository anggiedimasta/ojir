import { formatCurrency, formatDate } from '~/utils/formatting/formatters'

describe('Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
      expect(formatCurrency(0, 'USD')).toBe('$0.00')
      expect(formatCurrency(-500.25, 'USD')).toBe('-$500.25')
    })

    it('formats EUR currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
      expect(formatCurrency(0, 'EUR')).toBe('€0.00')
    })

    it('formats GBP currency correctly', () => {
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56')
    })

    it('handles large numbers', () => {
      expect(formatCurrency(1234567.89, 'USD')).toBe('$1,234,567.89')
      expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00')
    })

    it('handles decimal precision', () => {
      expect(formatCurrency(1234.1, 'USD')).toBe('$1,234.10')
      expect(formatCurrency(1234.999, 'USD')).toBe('$1,235.00')
    })

    it('defaults to USD when currency is not provided', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('handles edge cases', () => {
      expect(formatCurrency(0.01, 'USD')).toBe('$0.01')
      expect(formatCurrency(0.001, 'USD')).toBe('$0.00')
      expect(formatCurrency(NaN, 'USD')).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    const testDate = new Date('2024-03-15T10:30:00Z')

    it('formats date in default format', () => {
      const result = formatDate(testDate)
      expect(result).toMatch(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/)
    })

    it('formats date as short format', () => {
      const result = formatDate(testDate, 'short')
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
    })

    it('formats date as medium format', () => {
      const result = formatDate(testDate, 'medium')
      expect(result).toMatch(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/)
    })

    it('formats date as long format', () => {
      const result = formatDate(testDate, 'long')
      expect(result).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/)
    })

    it('handles string dates', () => {
      const result = formatDate('2024-03-15')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('handles invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date')
      expect(formatDate(null as any)).toBe('Invalid Date')
      expect(formatDate(undefined as any)).toBe('Invalid Date')
    })

    it('handles edge cases', () => {
      const futureDate = new Date('2030-12-31T23:59:59Z')
      const pastDate = new Date('1990-01-01T00:00:00Z')
      
      expect(formatDate(futureDate)).toBeTruthy()
      expect(formatDate(pastDate)).toBeTruthy()
    })
  })
})