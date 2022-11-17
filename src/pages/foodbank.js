// @mui
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
// sections
import { AboutHero, AboutWhat, AboutTeam, AboutVision, AboutTestimonials } from '../sections/about';
import AboutFoodbank from 'src/sections/about/AboutFoodbank';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11),
    },
}));

// ----------------------------------------------------------------------

FoodBank.getLayout = function getLayout(page) {
    return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function FoodBank() {
    return (
        <Page title="About Food Bank">
            <RootStyle>
                <AboutFoodbank />
            </RootStyle>
        </Page>
    );
}
