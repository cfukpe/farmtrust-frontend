// @mui
import { useTheme } from '@mui/material/styles';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, Stack, TextField, Typography } from '@mui/material';
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
import WithdrawalsTable from 'src/sections/@dashboard/general/app/WithdrawalsTable';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

Withdrawals.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Withdrawals() {
    const { user } = useAuth();

    const [withdrawals, setWithdrawals] = useState([]);
    const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false)

    useEffect(() => {
        const initiate = async () => {
            try {
                const res = await axiosInstance.get(`/user/${user?.id}/withdrawals`)
                console.log(res)
                setWithdrawals(res.data?.data);
            } catch (error) {
                console.log(error);
            }
        }

        initiate();
    }, [])

    const theme = useTheme();

    const { themeStretch } = useSettings();

    const { enqueueSnackbar } = useSnackbar()



    // const initializePayment = usePaystackPayment(paystackConfig);
    const handleAddFund = async () => {
        // if (amountToSave < 200) return enqueueSnackbar("You can only save a minimun of 200 Naira", {
        //     variant: 'error'
        // });
        initializePayment(onAddMoneySuccess, onCancelAddMoney)

    }

    const onAddMoneySuccess = async (transaction) => {
        const { trxref } = transaction;

        try {
            const res = await axiosInstance.post('/user/foodbank', {
                trxref,
            });

            setFoodBankSavings(prev => [
                res.data?.data,
                ...prev
            ])

            setTotal(prev => prev + (res.data.data?.investment_amount || 0))
            setAvailableBalance(prev => prev + (res.data.data?.investment_amount || 0))
        } catch (error) {
            enqueueSnackbar(APIErrorHandler(error), {
                variant: 'error'
            })
        }
    }

    const onCancelAddMoney = () => {

    }

    return (
        <Page title="Dashboard: Food Bank">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <AppWidgetSummary
                            title="Total Withdrawal"
                            percent={-0.1}
                            total={501300}
                            chartColor={theme.palette.chart.red[0]}
                            chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            onClick={() => setShowWithdrawalDialog(true)}
                            color="success" variant='contained'>
                            New Withdrawal <Iconify icon='uil:money-withdraw' color="#f89" /></Button>
                    </Grid>

                    <Grid item xs={12} lg={12}>
                        <WithdrawalsTable
                            withdrawals={withdrawals}
                        />
                    </Grid>

                </Grid>
            </Container>
            <Dialog open={showWithdrawalDialog} onClose={() => setShowWithdrawalDialog(false)}>
                <DialogTitle>
                    <Typography variant='h3' color='success'>
                        Withdraw Money
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container>
                        <Grid md={6}>
                            <TextField
                                label='Account Name'
                            />
                        </Grid>
                        <Grid md={6}>
                            <TextField
                                label='Account Number'
                            />
                        </Grid>

                        <Grid md={12} my={2}>
                            <TextField
                                select
                                label='Select Bank'
                                fullWidth
                            >
                                <option>Access Bank PLC</option>
                                <option>Zenith Bank</option>
                                <option>GT Bank</option>
                                <option>Keystone Bank</option>
                                <option>Kuda MFB</option>
                                <option>Diamond (Access) Bank</option>
                                <option>FCMB</option>
                                <option>First Bank PLC</option>
                                <option>UBA</option>
                                <option>Union Bank</option>
                                <option>Unity Bank</option>
                            </TextField>
                        </Grid>

                        <Grid md={12}>
                            <TextField
                                label='Amount to Withdraw'
                                fullWidth
                            />
                        </Grid>

                        <Grid xs={12}>
                            <Typography color='error' my={1} variant='body2'>Please note that you need to use the platform for three months before requesting withdrawal.</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained'>Request</Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
}
