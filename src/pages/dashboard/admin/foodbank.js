// @mui
import { useTheme } from '@mui/material/styles';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, styled, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
// sections
import { useEffect, useState } from 'react';
import { APPROVED, FARMER, PENDING } from 'src/utils/constants';
import Link from 'next/link';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MUIDataTable from 'mui-datatables';
import SavingService from 'src/services/savings.service';
import { formatName } from 'src/utils/dataFormat';
import moment from 'moment';
import { APIErrorHandler, getHostAPIBase } from 'src/utils/axios';
import Label from 'src/components/Label';
import { useSnackbar } from 'notistack';
import FoodBankService from 'src/services/foodbank.service';

// ----------------------------------------------------------------------

FoodBankSavings.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

const TABLE_COLUMNS = [
    {
        name: '#',
    }, {
        name: 'Name',
    },
    {
        name: 'Phone',
        options: {
            filter: false
        }
    },
    {
        name: 'Amount',
        options: {
            filter: false,
        }
    },
    {
        name: 'date',
        options: {
            filter: false
        }
    },
    {
        name: 'status',
        options: {
            customBodyRender: status => <Label color={status === PENDING ? 'warning' : status == APPROVED ? 'success' : 'danger'}>{status}</Label>
        }
    },
    {
        name: '',
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: '',
        options: {
            filter: false,
            sort: false,
        }
    },
]

const SuccessDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.success.main
}))


export default function FoodBankSavings() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [savings, setSavings] = useState([]);

    const [activeProof, setActiveProof] = useState(null);

    const [savingToApprove, setSavingToApprove] = useState(null);

    const fetchInitialData = async () => {
        try {
            const res = await FoodBankService.getAllFoodBank();
            setSavings(res.data?.data)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const { enqueueSnackbar } = useSnackbar()


    const handleShowProof = (saving) => {
        return setActiveProof(saving?.proof_upload_url);
    }

    const handleApproveSaving = async () => {
        try {
            setLoading(true);
            const res = await FoodBankService.approveFoodBankSaving(savingToApprove?.id);

            setSavings(prev => prev.map(saving => {
                if (saving?.id === savingToApprove?.id) {
                    return res.data?.data
                }
                return saving;
            }))

            setSavingToApprove(null);

            return enqueueSnackbar('Food bank saving has been approved', {
                variant: 'success',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                }
            })

        } catch (error) {
            enqueueSnackbar(APIErrorHandler(error), {
                variant: 'error',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                }
            })
        } finally {
            setLoading(false)
        }
    }


    const { themeStretch } = useSettings();

    return (
        <Page title="Dashboard:">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="All User Food Bank Savings"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Admin', href: '' },
                        { name: 'Food Bank' },
                    ]}
                />
                <Grid container spacing={3}>

                    <Grid item xs={12} m='0 auto'>
                        <MUIDataTable
                            title={loading ? <CircularProgress /> : null}
                            columns={TABLE_COLUMNS}
                            data={savings.map((saving, index) => ([
                                index + 1,
                                formatName(saving?.user),
                                saving?.user?.email,
                                saving.amount,
                                moment(saving?.created_at).format('D-M-YYYY'),
                                saving?.status,
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => handleShowProof(saving)}
                                    size='small'>View Proof</Button>,
                                saving?.status === PENDING && <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => setSavingToApprove(saving)}
                                    size='small'>Approve</Button>,

                            ]))}
                            options={{
                                elevation: 0,

                            }}
                        />
                    </Grid>

                </Grid>
                <Dialog open={activeProof} fullWidth onClose={() => setActiveProof(null)}>
                    <DialogTitle>Proof</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <img src={`${getHostAPIBase()}${activeProof}`} />
                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                </Dialog>

                <Dialog open={savingToApprove} fullWidth onClose={() => setSavingToApprove(null)}>
                    <SuccessDialogTitle>Approve Food Bank Saving</SuccessDialogTitle>
                    <Divider />
                    <DialogContent>
                        <Typography variant='body'>Are you sure you want to approve this food bank saving?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' color='primary' onClick={handleApproveSaving}>Confirm {loading && <CircularProgress />}</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Page>
    );
}
