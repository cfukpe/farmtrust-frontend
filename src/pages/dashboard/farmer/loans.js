// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
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
} from '../../../sections/@dashboard/general/app';
// eslint-disable-next-line import/no-unresolved
import { formatName } from 'src/utils/dataFormat';
import { useEffect } from 'react';
import { FARMER } from 'src/utils/constants';
import Link from 'next/link';

// ----------------------------------------------------------------------

TrustLoan.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TrustLoan() {
    const { user } = useAuth();

    useEffect(() => {
        if (user.role === FARMER && !user?.savings_plan) {
            return window.location.href = "/dashboard/plans"
        }

        if (user.role === FARMER && user?.savings_plan && !user?.farm) {
            return window.location.href = "/dashboard/plans/setting"
        }
    }, []);

    const theme = useTheme();

    const { themeStretch } = useSettings();

    return (
        <Page title="Dashboard:">
            <Container maxWidth={themeStretch ? false : 'xl'}>

                <Grid container spacing={3}>
                    {/* <Grid item xs={12} md={8}>
                        <AppWelcome displayName={formatName(user)} />
                    </Grid> */}

                    <Grid item xs={12} md={8} m='0 auto'>
                        <h1>
                            You are currently not eligible for Trust Loans.
                        </h1>
                        <h1>
                            You need to use our savings for at least 3 months
                        </h1>
                        <Link passHref href="#">See eligibility criteria</Link>
                        {/* <AppFeatured /> */}
                    </Grid>

                </Grid>
            </Container>
        </Page>
    );
}
