import { renderWithProviders, screen, userEvent } from '../../setup/test-utils'
import { Button } from '~/components/ui/button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      renderWithProviders(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('inline-flex items-center justify-center')
    })

    it('renders with custom className', () => {
      renderWithProviders(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('renders with different variants', () => {
      const { rerender } = renderWithProviders(
        <Button variant="outline">Outline</Button>
      )
      expect(screen.getByRole('button')).toHaveClass('border')

      rerender(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')

      rerender(<Button variant="destructive">Destructive</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-destructive')
    })

    it('renders with different sizes', () => {
      const { rerender } = renderWithProviders(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-11')
    })
  })

  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      renderWithProviders(<Button onClick={handleClick}>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not trigger click when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      renderWithProviders(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes when disabled', () => {
      renderWithProviders(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })

    it('supports custom ARIA attributes', () => {
      renderWithProviders(
        <Button aria-label="Custom label" aria-describedby="helper-text">
          Button
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
      expect(button).toHaveAttribute('aria-describedby', 'helper-text')
    })
  })

  describe('AsChild functionality', () => {
    it('renders as child component when asChild is true', () => {
      renderWithProviders(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('inline-flex items-center justify-center')
    })
  })
})