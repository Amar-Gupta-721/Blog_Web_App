import React from 'react';
import { Container, Logo } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import InputIcon from '@mui/icons-material/Input';
import PersonIcon from '@mui/icons-material/Person';
import { Divider, Tooltip } from '@mui/material';

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector(state=>state.auth.userData)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate('/login');
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  const navItems = [
    { name: 'Home', slug: '/', icon: <HomeIcon />, active: true },
    { name: 'Login', slug: '/login', icon: <LoginIcon />, active: !authStatus },
    { name: 'Signup', slug: '/signup', icon: <InputIcon />, active: !authStatus },
    { name: 'My Posts', slug: '/all-posts', icon: <LibraryBooksIcon />, active: authStatus },
    { name: 'Add Post', slug: '/add-post', icon: <PostAddIcon />, active: authStatus },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navItems.map((item) =>
          item.active ? (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => navigate(item.slug)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ) : null
        )}
        {authStatus && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => logoutHandler()}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
        <Divider/>
        {userData && (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><PersonIcon/></ListItemIcon>
            <ListItemText primary={userData.name} secondary={userData.email}/>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  

  return (
    <header className='py-3 shadow backdrop-blur-3xl'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          <ul className='hidden md:flex ml-auto'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='text-neutral-50 inline-block mx-2 px-6 py-2 duration-200 hover:bg-neutral-300 hover:text-neutral-950 focus:border border-neutral-100 rounded-full'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <button className='text-white inline-block px-6 py-2 duration-200 hover:bg-neutral-300 hover:text-neutral-950 rounded-full' onClick={logoutHandler}>Logout</button>
              </li>
            )}
            {userData && (
              <li className='text-neutral-50 inline-block mx-2 px-6 py-2 border border-neutral-100 rounded-full bg-neutral-800'>
              <Tooltip
                  title={userData.email}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '1rem',
                        backgroundColor: '#333',
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <h3>{userData.name}</h3>
                </Tooltip>
            </li>
            )}
          </ul>

          <div className='flex ml-auto md:hidden pt-2'>
            <MenuIcon onClick={toggleDrawer(true)} className='text-neutral-50' />
            <Drawer anchor={'left'} open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawerList()}
            </Drawer>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
