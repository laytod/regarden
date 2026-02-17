import { submitForm } from '@/lib/submitForm'

describe('submitForm', () => {
  it('builds mailto URL with subject and formatted body', () => {
    let captured = ''
    submitForm('Test Subject', { name: 'Jane', amount: 50 }, (url) => {
      captured = url
    })
    expect(captured).toContain('mailto:')
    expect(captured).toContain('katie@regardenus.org')
    expect(captured).toContain(encodeURIComponent('Test Subject'))
    expect(captured).toContain(encodeURIComponent('Name: Jane'))
    expect(captured).toContain(encodeURIComponent('Amount: 50'))
  })

  it('formats body with one entry per field', () => {
    let captured = ''
    submitForm('Donation', { firstName: 'John', lastName: 'Doe' }, (url) => {
      captured = url
    })
    const body = decodeURIComponent((captured.match(/body=([^&]+)/) ?? [])[1] ?? '')
    expect(body).toContain('First Name: John')
    expect(body).toContain('Last Name: Doe')
  })

  it('handles array values in body', () => {
    let captured = ''
    submitForm('Volunteer', { interests: ['Gardening', 'Teaching'] }, (url) => {
      captured = url
    })
    const body = decodeURIComponent((captured.match(/body=([^&]+)/) ?? [])[1] ?? '')
    expect(body).toContain('Interests: Gardening, Teaching')
  })
})
