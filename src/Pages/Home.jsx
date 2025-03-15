import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Button,
    Typography,
    TextField,
    Container,
    Grid,
    Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PinDropIcon from '@mui/icons-material/PinDrop';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import Hero from '../Assets/BackGroundImg/Home.webp';
import vegis from '../Assets/images/farmer.png';
import Logo from '../Assets/images/Kisaanstarlogo1.webp';
import Services1 from '../Assets/images/AgriConsultancy.webp';
import Services2 from '../Assets/images/HomeDelivery.webp';
import Services3 from '../Assets/images/PremiumProducts.webp';
import Services4 from '../Assets/images/SoilTesting.webp';
import Services5 from '../Assets/images/AVTraningProgram.webp';
import Banner from '../Assets/BackGroundImg/web banner.webp';
import ProductList from './Productlist';

import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    // Services Data
    const services = [
        {
            image: Services1,
            title: 'Agri Consultancy',
            description:
                'Expert guidance and personalized recommendations to help optimize farming practices for better yields.',
        },
        {
            image: Services2,
            title: 'Home Delivery',
            description:
                'Hassle-free delivery of high-quality agricultural products directly to farmers.',
        },
        {
            image: Services3,
            title: 'Premium Products',
            description:
                'Providing 100% authentic and sustainable agri-inputs for improved productivity.',
        },
        {
            image: Services4,
            title: 'Soil Testing',
            description:
                'Understanding soil health to make informed decisions for better crop growth.',
        },
        {
            image: Services5,
            title: 'AgriVision Training Program',
            description:
                'Comprehensive training programs designed to give farmers valuable skills and 100% placement assistance.',
        },
    ];

    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Button styles
    const buttonStyles = {
        fontFamily: 'Exo, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        color: '#FFF',
        backgroundColor: '#DAB060',
        border: 0,
        padding: '8px 16px',
        position: 'relative',
        transition: 'transform 0.1s',
        '&:hover': {
            transform: 'translateY(-10%) scale(1.1)',
            boxShadow: '0 0 10px rgba(218, 176, 96, 0.5)',
        },
        '&:active': {
            transform: 'translateY(5%) scale(0.9)',
        },
    };

    const phoneNumber = "+91 8830385928";
    const emailAddress = "info@kisaanstar.com";
    const address = "4th floor, office number 401, Vishwaraj Pride, Nagar Rd, near hp petrol pump, Wagholi, Pune, Maharashtra 412207";

    return (
        <>
            {/* Header Section */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: scrolled ? '#445038' : 'transparent',
                    boxShadow: 'none',
                    zIndex: 1201,
                    transition: 'background-color 0.3s ease',
                }}
            >
                <Toolbar className="d-flex justify-content-between align-items-center" sx={{ padding: '0 20px' }}>
                    <img src={Logo} alt="Logo" style={{ height: '60px', borderRadius: '20px' }} />
                    <nav className="d-none d-md-block">
                        <ul className="list-unstyled d-flex mb-0">
                            {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                                <li className="mx-3" key={index}>
                                    <Button color="inherit" sx={{ color: scrolled ? '#fff' : '#000', fontFamily: 'Exo, sans-serif', '&:hover': { border: '2px solid #DAB060', borderRadius: '5px', boxShadow: '0 0 10px rgba(218, 176, 96, 0.5)', }, }}>
                                        {item}
                                    </Button>
                                </li>
                            ))}
                            <li className="mx-3">
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="inherit"
                                    sx={{ color: scrolled ? '#fff' : '#000', fontFamily: 'Exo, sans-serif', '&:hover': { border: '2px solid #DAB060', borderRadius: '5px', boxShadow: '0 0 10px rgba(218, 176, 96, 0.5)', }, }}
                                >
                                    CRM
                                </Button>
                            </li>
                        </ul>
                    </nav>
                    <div className="d-flex align-items-center">
                        <div className="position-relative" style={{ width: 'auto' }}>
                            <InputBase
                                placeholder="Search..."
                                sx={{
                                    border: '1px solid #FFF',
                                    borderRadius: '4px',
                                    padding: '2px 10px',
                                    backgroundColor: '#fff',
                                    minWidth: '150px',
                                    maxWidth: '250px',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            />
                            <IconButton type="submit" sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', backgroundColor: '#DAB060', '&:hover': { backgroundColor: '#c59b03', }, }}>
                                <SearchIcon sx={{ color: '#445038' }} />
                            </IconButton>
                        </div>
                        <IconButton edge="end" color="inherit" sx={{ marginLeft: '10px', color: '#FFF' }}>
                            <ShoppingCartIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            {/* Hero Image Section */}
            <div className="position-relative" style={{ overflow: 'hidden' }}>
                <img src={Hero} alt="Hero Background" className="img-fluid" style={{ width: '100%', height: 'auto', maxHeight: '1000px', objectFit: 'cover' }} />
            </div>

        {/* Introductory Text and Image */}
<div className="row no-gutters" style={{ width: '100%', margin: 0 }}>
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center" style={{ height: '80vh', padding: '0' }}>
        <Box textAlign="left" style={{ width: '100%' }}>
            <Typography variant="h2" sx={{ fontFamily: 'Exo, sans-serif', color: 'black', marginBottom: '16px' }}>
                Cultivating Success, Harvesting Growth
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', color: 'black', marginBottom: '24px' }}>
                "KisaanStar is an innovative e-commerce platform dedicated to empowering farmers by providing high-quality agricultural products."
            </Typography>
            <Button variant="contained" sx={buttonStyles} style={{ marginRight: '10px' }}>Learn More</Button>
            <Button variant="contained" sx={buttonStyles}>Connect Now!</Button>
        </Box>
    </div>
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center" style={{ height: '80vh', padding: '0' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={vegis} alt='Farmers' className='img-fluid' style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
        </div>
    </div>
</div>

          {/* Services Section */}
<Box className="text-center my-5" sx={{ borderRadius: '30px', padding: '20px', width: '100%', mx: 'auto' }}>
    <Typography variant="h5" sx={{ fontFamily: 'Exo, sans-serif' }}>Our Services</Typography>
    <Typography variant="h4" sx={{ fontFamily: 'Exo, sans-serif' }}>What Do We Do?</Typography>
    <Typography sx={{ fontFamily: 'Inter, sans-serif', marginBottom: '84px' }}>We offer a variety of services to support our farmers.</Typography>

    <Grid container spacing={8} className="my-4">
        {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease',
                        borderRadius: '15px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <img src={service.image} alt={`Image of ${service.title}`} className='img-fluid' style={{ width: '50%', borderRadius: '15px', marginBottom: '10px' }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Exo, sans-serif' }}>{service.title}</Typography>
                    <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>{service.description}</Typography>
                </Box>
            </Grid>
        ))}
    </Grid>
</Box>

            {/* Banner Image */}
            <div>
                <img src={Banner} alt="Promotional Banner" className="img-fluid unique-banner-style" />
            </div>

            {/* Products List */}
            <ProductList />

            {/* Contact Us Section */}
            <Container className="my-5">
                <div className="row">
                    <div className="col-md-6">
                        <Typography variant="h4" sx={{ fontFamily: 'Exo, sans-serif' }}>Contact Us</Typography>
                        <form>
                            <TextField fullWidth label="Name" variant="outlined" margin="normal" sx={{ fontFamily: 'Inter, sans-serif', marginBottom: 2 }} />
                            <TextField fullWidth label="Email" variant="outlined" margin="normal" sx={{ fontFamily: 'Inter, sans-serif', marginBottom: 2 }} />
                            <TextField fullWidth label="Message" variant="outlined" margin="normal" multiline rows={4} sx={{ fontFamily: 'Inter, sans-serif', marginBottom: 2 }} />
                            <Button variant="contained" sx={buttonStyles} type="submit">Send Message</Button>
                        </form>
                    </div>

                    <div className="col-md-6">
                        <Typography variant="h4" sx={{ fontFamily: 'Exo, sans-serif' }}>Company Information</Typography>
                        <div className="d-flex align-items-center mb-2">
                            <PhoneInTalkIcon />
                            <Typography variant="body1" sx={{ ml: 2 }} component="a" href={`tel:${phoneNumber}`} sx={{ fontFamily: 'Inter, sans-serif' }}>{phoneNumber}</Typography>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <MailOutlineIcon />
                            <Typography variant="body1" sx={{ ml: 2 }} component="a" href={`mailto:${emailAddress}`} sx={{ fontFamily: 'Inter, sans-serif' }}>{emailAddress}</Typography>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <PinDropIcon />
                            <Typography
                                variant="body1"
                                sx={{ ml: 2, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')}
                            >
                                Address: {address}
                            </Typography>
                        </div>
                        <Typography variant="h4" sx={{ fontFamily: 'Exo, sans-serif' }}>Follow Us</Typography>
                        <div className="d-flex justify-content-start">
                            <IconButton
                                aria-label="instagram"
                                sx={{ color: '#C13584', margin: '0 5px', fontSize: '2rem' }}
                                component="a"
                                href="https://www.instagram.com/kisaanstar?igsh=YWs3d2V3MW5oejE"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InstagramIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                aria-label="youtube"
                                sx={{ color: '#FF0000', margin: '0 5px', fontSize: '2rem' }}
                                component="a"
                                href="https://youtube.com/@kisaanstar?si=21s_5XXHiH7HwGdO"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <YouTubeIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                aria-label="linkedin"
                                sx={{ color: '#0077B5', margin: '0 5px', fontSize: '2rem' }}
                                component="a"
                                href="https://www.linkedin.com/company/kisaanstar"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedInIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Footer Section */}
            <footer className="bg-white text-center py-4" style={{ backgroundColor: '#445038' }}>
                <Typography variant="body1" sx={{ color: '#FFF', fontFamily: 'Inter, sans-serif' }}>
                    © {new Date().getFullYear()} Kisaanstar PvtLtd - All Rights Reserved
                </Typography>
                <div className="d-flex justify-content-center">
                    <Button sx={{ ...buttonStyles, color: '#FFF' }}>Privacy Policy</Button>
                    <Button sx={{ ...buttonStyles, color: '#FFF', marginLeft: '20px' }}>Terms of Use</Button>
                </div>
            </footer>
        </>
    );
}

export default Home;