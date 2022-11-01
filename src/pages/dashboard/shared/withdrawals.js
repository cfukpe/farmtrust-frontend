// @mui
import { useTheme } from '@mui/material/styles';
import { Button, Container, Grid, Input, Stack, TextField } from '@mui/material';
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
                        <Button color="success" variant='contained'>
                            New Withdrawal <Iconify icon='uil:money-withdraw' color="#f89" /></Button>
                    </Grid>

                    <Grid item xs={12} lg={12}>
                        <WithdrawalsTable
                            withdrawals={withdrawals}
                        />
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
