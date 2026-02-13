import { render, screen } from '@testing-library/react'
import ContentSection from '@/components/Admin/ContentSection'

describe('ContentSection', () => {
  it('should render title and children', () => {
    render(
      <ContentSection title="Test Section">
        <p>Child content</p>
      </ContentSection>
    )
    expect(screen.getByRole('heading', { name: /test section/i })).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('should render optional description', () => {
    render(
      <ContentSection title="Section" description="Helper text">
        <div>Body</div>
      </ContentSection>
    )
    expect(screen.getByText('Helper text')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('should not render description when omitted', () => {
    render(
      <ContentSection title="Section">
        <span>Only body</span>
      </ContentSection>
    )
    expect(screen.getByText('Only body')).toBeInTheDocument()
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
  })
})
