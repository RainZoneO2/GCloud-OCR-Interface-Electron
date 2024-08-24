import PropTypes from 'prop-types'

export const RootLayout = ({ children }) => {
  return <main className="flex-grow container mx-auto p-4">{children}</main>
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired
}
