import { forwardRef } from 'react'

const Card = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-surface border border-border rounded-card shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'

function Header({ children, className = '', ...props }) {
  return (
    <div className={`border-b border-border pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
Header.displayName = 'Card.Header'

function Title({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-bold text-text ${className}`} {...props}>
      {children}
    </h3>
  )
}
Title.displayName = 'Card.Title'

function Description({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-text-muted mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  )
}
Description.displayName = 'Card.Description'

function Body({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
Body.displayName = 'Card.Body'

function Footer({ children, className = '', ...props }) {
  return (
    <div className={`border-t border-border pt-4 mt-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
Footer.displayName = 'Card.Footer'

export { Header, Title, Description, Body, Footer }
export default Card
