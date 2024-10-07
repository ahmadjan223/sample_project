import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import List from '@mui/material/List'; // Import List
import ListItem from '@mui/material/ListItem'; // Import ListItem
import ListItemText from '@mui/material/ListItemText'; // Import ListItemText
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = React.useState(false);
  const [currentSegment, setCurrentSegment] = React.useState('');

  const handleTileClick = (segment) => {
    if (segment === 'orders') {
      setIsSecondarySidebarOpen(true);
      setCurrentSegment('Orders');
    } else {
      setPathname(`/${segment}`);
    }
  };

  const handleBackClick = () => {
    setIsSecondarySidebarOpen(false); // Go back to main sidebar
  };

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout disableCollapsibleSidebar
        >
          {/* Main Sidebar */}
          {/* <Drawer variant="permanent" open>
            <List>
              {NAVIGATION.map((item) => (
                item.segment && (
                  <ListItem button key={item.segment} onClick={() => handleTileClick(item.segment)}>
                    {item.icon}
                    <ListItemText primary={item.title} />
                  </ListItem>
                )
              ))}
            </List>
          </Drawer> */}

          {/* Dashboard content */}
          {/* <DemoPageContent pathname={pathname} /> */}

          {/* Secondary Sidebar for "Orders" */}
          {/* {isSecondarySidebarOpen && (
            <Drawer
              variant="temporary"
              anchor="left"
              open={isSecondarySidebarOpen}
              onClose={handleBackClick}
            >
              <Box sx={{ width: 250, p: 2 }}>
                <IconButton onClick={handleBackClick}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {currentSegment}
                </Typography>
              </Box>
            </Drawer>
          )} */}
        </DashboardLayout>
      </AppProvider>
    </Box>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
