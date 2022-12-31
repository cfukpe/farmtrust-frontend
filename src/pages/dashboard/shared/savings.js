// @mui
import { useTheme } from '@mui/material/styles';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, Stack, TextField, Typography } from '@mui/material';
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
import { useEffect, useState } from 'react';
import { FARMER } from 'src/utils/constants';
import FoodBankSavingsTable from 'src/sections/@dashboard/general/app/FoodBankSavingsTable';
import { useSnackbar } from 'notistack';
import { usePaystackPayment } from 'react-paystack';
import axiosInstance, { APIErrorHandler } from 'src/utils/axios';
import Iconify from 'src/components/Iconify';
import SavingsTable from 'src/sections/@dashboard/general/app/SavingsTable';

// ----------------------------------------------------------------------

Savings.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Savings() {
    const { user } = useAuth();

    const [amountToSave, setAmountToSave] = useState(0);

    const [foodBankSavings, setFoodBankSavings] = useState([]);

    const [availableBalance, setAvailableBalance] = useState([]);

    const [withdrawals, setWithdrawals] = useState(0);

    const [total, setTotal] = useState(0);

    const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [proofOfPayment, setProofOfPayment] = useState(null);

    useEffect(() => {
        const initiate = async () => {
            try {
                const res = await axiosInstance.get(`/user/${user?.id}/saving`)
                const analyticaRes = await axiosInstance.get(`/user/${user?.id}/saving/analytics`)
                setFoodBankSavings(res.data?.data)
                const { total, withdrawals } = analyticaRes.data?.data;
                setAvailableBalance(total - withdrawals)
                setTotal(total)
                setWithdrawals(withdrawals)
            } catch (error) {
                console.log(error);
            }
        }

        initiate();
    }, [])

    const theme = useTheme();

    const { themeStretch } = useSettings();

    const { enqueueSnackbar } = useSnackbar()

    const handleAmountToSaveChange = (e) => {
        const { value } = e.target;

        if (value < 0) return setAmountToSave(0);

        return setAmountToSave(value);
    }

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: user?.email,
        amount: amountToSave * 100,
        publicKey: process.env.PAYSTACK_PK,
    };


    const initializePayment = usePaystackPayment(paystackConfig);
    const handleAddFund = async () => {
        if (amountToSave < 200) return enqueueSnackbar("You can only save a minimun of 200 Naira", {
            variant: 'error'
        });

        if (!proofOfPayment) {
            return enqueueSnackbar("You must upload proof of payment", {
                variant: 'error'
            });
        }

        const formData = new FormData();

        formData.append('amount', amountToSave);
        formData.append('file', proofOfPayment);



        try {
            setIsLoading(true);
            const res = await axiosInstance.post('/user/saving', formData);
            setShowAddMoneyDialog(false);
            setProofOfPayment(null);
            enqueueSnackbar("Money has been requested. Fund will be credited after verification. Please wait", {
                variant: 'success',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                }
            });
            setFoodBankSavings(prev => [
                res.data?.data,
                ...prev
            ])
        } catch (error) {
            enqueueSnackbar(APIErrorHandler(error), {
                variant: 'error'
            })
        } finally {
            setIsLoading(false)
        }

        // initializePayment(onAddMoneySuccess, onCancelAddMoney)

    }

    const onAddMoneySuccess = async (transaction) => {
        const { trxref } = transaction;

        try {
            const res = await axiosInstance.post('/user/saving', {
                trxref,
            });

            setFoodBankSavings(prev => [
                res.data?.data,
                ...prev
            ])

            // setTotal(prev => prev + (res.data.data?.investment_amount || 0))
            // setAvailableBalance(prev => prev + (res.data.data?.investment_amount || 0))
        } catch (error) {
            enqueueSnackbar(APIErrorHandler(error), {
                variant: 'error'
            })
        }
    }

    const handleProofOfPaymentChange = e => {
        const file = e.target.files[0];
        setProofOfPayment(file);
    }

    return (
        <Page title="Dashboard: Food Bank">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <AppWidgetSummary
                            title="My Savings"
                            percent={-0.1}
                            total={total}
                            chartColor={theme.palette.chart.red[0]}
                            chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <AppWidgetSummary
                            title="Available"
                            percent={-0.1}
                            total={availableBalance}
                            chartColor={theme.palette.chart.red[0]}
                            chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <AppWidgetSummary
                            title="Withdrawn"
                            percent={-0.1}
                            total={withdrawals}
                            chartColor={theme.palette.chart.red[0]}
                            chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button onClick={() => setShowAddMoneyDialog(true)} variant='contained'>Add Money <Iconify icon='il:money' /> </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' color='success'><b>Savings Plan:</b> </Typography>
                        <Typography variant='subtitle2'>{user?.savings_plan} <Iconify icon='typcn:edit' sx={{
                            color: "#f38",
                            cursor: 'pointer'
                        }} /> </Typography>
                    </Grid>

                    <Grid item xs={12} lg={12}>
                        <SavingsTable
                            foodBankSavings={foodBankSavings}
                        />
                    </Grid>
                    <Dialog fullWidth open={showAddMoneyDialog} onClose={() => setShowAddMoneyDialog(false)}>
                        <DialogTitle>
                            <Typography variant='h3' color='primary'>
                                Add Money
                            </Typography>
                        </DialogTitle>

                        <Divider />
                        <DialogContent>
                            <Grid xs={12} >
                                <Typography variant='body2'>Amount to credit</Typography>
                                <TextField
                                    fullWidth
                                    value={amountToSave}
                                    onChange={handleAmountToSaveChange}
                                    type='number'
                                // InputProps={{
                                //     endAdornment: <Button
                                //         variant='contained'
                                //         color="success"
                                //         onClick={handleAddFund}
                                //         size='2' >Add </Button>
                                // }}
                                />
                            </Grid>
                            <Grid xs={12} >
                                <Typography my={2} variant='body2'>Upload proof of payment</Typography>
                                <input
                                    fullWidth
                                    // value={amountToSave}
                                    onChange={handleProofOfPaymentChange}
                                    type='file'
                                    accept="image/png,image/jpg,image/jpeg,image/webp"
                                />
                                <Typography type='body' color='primary'>
                                    {proofOfPayment?.name}
                                </Typography>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                disabled={isLoading}
                                onClick={handleAddFund}
                                variant='contained'>Add money {isLoading && <CircularProgress />} </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Container>
        </Page >
    );
}
