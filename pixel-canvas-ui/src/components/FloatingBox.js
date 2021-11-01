import './FloatingBox.css'

// Helper for displaying a floating box in absolute position
const FloatingBox = ({ children, top, bottom, left, right }) => {
  const boxStyle = {
    top,
    bottom,
    left,
    right,
  }

  return (
    <div className="floating-box" style={boxStyle}>
      {children}
    </div>
  )
}

export default FloatingBox
