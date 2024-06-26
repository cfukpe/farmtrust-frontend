// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from '../sections/home';
import InvestmentProducts from 'src/components/pages/home/InvestmentProducts';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Welcome to farmer's trust">
      <RootStyle>
        {/* <HomeHero /> */}
        <ContentStyle>

          {/* <HomeHugePackElements /> */}

          {/* <HomeDarkMode /> */}

          {/* <HomeColorPresets /> */}

          {/* <HomeCleanInterfaces /> */}


          {/* <HomeLookingFor /> */}

          <HomeAdvertisement />
          <HomePricingPlans />
          <HomeMinimal />
          {/* <InvestmentProducts /> */}
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
