// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// eslint-disable-next-line import/no-unresolved
import { formatName } from 'src/utils/dataFormat';
import { useEffect, useState } from 'react';
import { FARMER } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const [userAnalytics, setUserAnalytics] = useState({
    total_savings: 0,
    total_foodbank: 0,
    total_widthdrawals: 0,
  })

  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    if (user.role === FARMER && !user?.savings_plan) {
      return window.location.href = "/dashboard/plans"
    }

    if (user.role === FARMER && user?.savings_plan && !user?.farm) {
      return window.location.href = "/dashboard/plans/setting"
    }

    const init = async () => {
      try {
        setLoadingAnalytics(true)
        const res = await axiosInstance.get('/user/home/analytics');
        console.log(res)
        setUserAnalytics(res.data?.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAnalytics(false)
      }
    }

    init();
  }, []);

  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title="Dashboard:">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={formatName(user)} />
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <AppFeatured /> */}
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Savings"
              percent={2.6}
              total={userAnalytics?.total_savings ?? 0}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Foodbank total"
              percent={0.2}
              total={userAnalytics?.total_foodbank ?? 0}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Withdrawals"
              percent={-0.1}
              total={userAnalytics.total_widthdrawals}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload chartData={[userAnalytics.total_savings, userAnalytics.total_withdrawals]} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={12}>
            <AppNewInvoice />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
