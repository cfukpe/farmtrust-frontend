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
import { useFlutterwave } from 'flutterwave-react-v3'
// import Flutterwave from 'flutterwave-node-v3'
import useAuth from 'src/hooks/useAuth';
import axiosInstance from 'src/utils/axios';


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

    const plan = useSelector(state => state.plan)
    const auth = useAuth()

    const user = auth?.user;

    const config = {
        public_key: 'FLWPUBK_TEST-c5a322bf030af760d25fcb85d7bb2842-X',
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

    const dispatch = useDispatch();

    const handlePay = useFlutterwave(config)

    const FLPK = 'FLWPUBK_TEST-c5a322bf030af760d25fcb85d7bb2842-X'
    const FLSK = 'FLWSECK_TEST-26ec1af8f98d20fbfd2691826361ad5e-X'


    const handleChargeSuccess = async (response) => {
        console.log(response, response.transaction_id)
        try {
            const res = await axiosInstance.post('/user/card-setting/verify', {
                transactionId: response.transaction_id?.toString()
            });
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

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
                                onClick={() => handlePay({
                                    callback: handleChargeSuccess,
                                    onClose: () => {
                                        console.log("Closed")
                                    }
                                })}
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
