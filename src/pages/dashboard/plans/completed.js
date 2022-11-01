// @mui
import { Button, Container, Grid, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';
import FarmSettingForm from 'src/sections/@dashboard/farm/FarmSettingForm';
import Link from 'next/link';
import { usePaystackPayment } from 'react-paystack';
import axiosInstance from 'src/utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { INITIALIZE } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

FarmSettingComplete.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

const styles = {
    img: {
        maxWidth: "200px",
        margin: '0 auto',
        display: 'block',
    },
    button: {
        margin: "1rem 0"
    }
}

// ----------------------------------------------------------------------

export default function FarmSettingComplete() {

    const [isSubscribedToFarmTrust, setIsSubscribedToFarmTrust] = useState(false);

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const user = useAuth().user;
    useEffect(() => {
        setIsSubscribedToFarmTrust(user?.is_trust_member)
    }, [])

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: "farmer@gmail.com",
        amount: 900000,
        publicKey: process.env.PAYSTACK_PK,
    };


    const initializePayment = usePaystackPayment(paystackConfig);

    const onFarmTrustSubscribeSuccess = async (response) => {
        const { trxref } = response;
        const res = await axiosInstance.post('/user/subscription/farm-trust', {
            transactionId: trxref
        });

        setIsSubscribedToFarmTrust(true);
        return enqueueSnackbar("You have successfully subscribed to trust.")
    }

    const onCancelSubscription = () => {

    }

    const handleSubscribeToTrust = () => {
        initializePayment(onFarmTrustSubscribeSuccess, onCancelSubscription)
    }

    const { themeStretch } = useSettings();

    return (
        <Page title="Farm: Farm Settings">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Congratulations! Setup Completed"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Farmer', href: PATH_DASHBOARD.root },
                        { name: 'Farm Setup Completed' },
                    ]}
                />
                <Grid container>
                    <Grid item xs={12} >
                        <img style={styles.img} src='/static/img/lottie/checked.gif' />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={12} textAlign="center">
                        <Typography variant='subtitle2'>
                            Our Trust Loan subscription gives you access to cash and equipment loan to sustain a successful farm
                        </Typography>
                        <Typography variant='subtitle2'>
                            Click the button below to subscribe
                        </Typography>
                        {!isSubscribedToFarmTrust && <Button
                            onClick={handleSubscribeToTrust}
                            style={styles.button} variant='contained' color="success" >Subscribe Now!</Button>}
                    </Grid>
                    {/* <Grid item xs={12} md={6} textAlign="center">
                        <Typography variant='subtitle2'>
                            Do you know you can save as little as 200 Naira daily to buy food?
                        </Typography>
                        <Typography variant='subtitle2'>
                            Subscribe to our food bank below
                        </Typography>
                        <Button style={styles.button} variant='contained' color="success" >Subscribe to Food bank!</Button>
                    </Grid> */}
                    <Grid item xs={12} textAlign="center">
                        <Link passHref href={PATH_DASHBOARD.root}>
                            <Button style={styles.button} variant='success' >Back to Dashboard</Button>
                        </Link>
                    </Grid>
                </Grid>
                {/* <FarmSettingForm /> */}
            </Container>
        </Page>
    );
}
