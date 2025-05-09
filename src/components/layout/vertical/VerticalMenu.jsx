// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href='/admin' icon={<i className='ri-mail-open-line' />}>
          Dashboard
        </MenuItem>
        <MenuItem href='/admin/inventory' icon={<i className='ri-mail-open-line' />}>
          Inventory
        </MenuItem>
        <MenuItem href='/admin/add' icon={<i className='ri-mail-open-line' />}>
          Add Product
        </MenuItem>
        <MenuItem href='/admin/scan' icon={<i className='ri-mail-open-line' />}>
          UPC Scan
        </MenuItem>
        <MenuItem href='/admin/orders' icon={<i className='ri-mail-open-line' />}>
          Orders
        </MenuItem>
        <MenuItem href='/admin/customers' icon={<i className='ri-mail-open-line' />}>
          Customers
        </MenuItem>
        <MenuItem href='/admin/newsletter' icon={<i className='ri-mail-open-line' />}>
          News Letter
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
