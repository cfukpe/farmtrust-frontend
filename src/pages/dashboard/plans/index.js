import { m } from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, Grid } from '@mui/material';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import { MotionContainer, varBounce } from '../../../components/animate';
import Iconify from 'src/components/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlan } from 'src/redux/slices/plan';
// import Flutterwave from 'flutterwave-node-v3'
import useAuth from 'src/hooks/useAuth';
import axiosInstance from 'src/utils/axios';
import { usePaystackPayment } from 'react-paystack';
import Router, { useRouter } from 'next/router';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

Plans.getLayout = function getLayout(page) {
    return <Layout variant="logoOnly">{page}</Layout>;
};

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
    {
        title: 'TRUST FLEXI SAVINGS',
        description: 'With Trust Flexi, you can save and withdraw your money at any time.',
        icon: 'ic:round-money',
    },
    {
        title: 'TRUST TARGET SAVINGS',
        description: 'Set a target you want to achieve over a period of time through savings.',
        icon: 'eva:clock-fill',
    },
    {
        title: 'TRUST FIXED ANNUAL SAVINGS',
        description: 'Set a target to save any amount you want for a period of one year to three years.',
        icon: 'ic:round-verified-user',
    },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    justifyContent: 'center',
    height: theme.spacing(8),
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

export default function Plans() {
    const { push } = useRouter();

    const plan = useSelector(state => state.plan)
    const auth = useAuth()

    const user = auth?.user;

    if (user?.savings_plan) {
        push('/dashboard/plans/setting')
        return window.location.href = "/dashboard/plans/setting"
    }

    const config = {
        public_key: process.env.FLUTTERWAVE_PK,
        tx_ref: Date.now(),
        amount: 1,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: user?.email,
            phonenumber: user?.phonenumber,
            name: user?.name,
        },
        customizations: {
            title: 'Card Verification',
            description: 'One Naira only will be deducted from your account to verify validity of your card',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: "farmer@gmail.com",
        amount: 100,
        publicKey: process.env.PAYSTACK_PK,
    };

    const dispatch = useDispatch();


    const handleChargeSuccess = async (response) => {
        try {
            const res = await axiosInstance.post('/user/card-setting/verify', {
                transactionId: response.transaction_id?.toString(),
                savings_plan: plan?.plan,
                user_id: user?.id,
            });

            push('/dashboard/plans/setting')
        } catch (error) {
            console.log(error)
        }
    }

    // you can call this function anything
    const onSuccess = async (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        const res = await axiosInstance.post('/user/card-setting/verify', {
            transactionId: reference?.trxref,
            savings_plan: plan?.plan,
            user_id: user?.id,
        });

        if (auth?.user?.role?.toUpperCase() === "FARMER")
            push('/dashboard/plans/setting')

        push('/dashboard/');
    };

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
    }

    const initializePayment = usePaystackPayment(paystackConfig);

    return (
        <Page title="Savings Plan" sx={{ height: 1 }}>
            <RootStyle>
                <Container component={MotionContainer}>
                    <Box sx={{ maxWidth: 680, margin: 'auto', textAlign: 'center' }}>
                        <m.div variants={varBounce().in}>
                            <Typography variant="h3" paragraph>
                                Savings plan
                            </Typography>
                        </m.div>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Please select a saving plan. Let's help you achieve your goals
                        </Typography>
                        <m.div variants={varBounce().in}>
                            <Grid container sx={{ my: 8 }}>
                                {PRODUCT_DESCRIPTION.map((item) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={4}
                                        key={item.title}
                                        style={
                                            {
                                                cursor: "pointer",
                                                border: plan?.plan === item.title ? "1px solid #349934" : 'none'
                                            }
                                        }
                                        onClick={() => dispatch(selectPlan(item.title))}
                                    >
                                        <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                                            <IconWrapperStyle>
                                                <Iconify icon={item.icon} width={36} height={36} />
                                            </IconWrapperStyle>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                            {/* <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} /> */}
                        </m.div>
                        {plan?.plan &&
                            // <NextLink href="/" passHref>
                            <Button
                                size="large"
                                // onClick={() => handlePay({
                                //     callback: handleChargeSuccess,
                                //     onClose: () => {
                                //         console.log("Closed")
                                //     }
                                // })}
                                onClick={() => {
                                    initializePayment(onSuccess, onClose)
                                }}
                                variant="contained">
                                Continue
                            </Button>
                            || null}
                    </Box>
                </Container>
            </RootStyle>
        </Page >
    );
}
