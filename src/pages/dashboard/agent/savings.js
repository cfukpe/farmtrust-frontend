// @mui
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, TextField, Typography, } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
// sections
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MUIDataTable from 'mui-datatables';
import SavingService from 'src/services/savings.service';
import { formatName } from 'src/utils/dataFormat';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import UserService from 'src/services/user.service';
import { APIErrorHandler, getHostAPIBase } from 'src/utils/axios';
import Label from 'src/components/Label';
import { APPROVED, PENDING } from 'src/utils/constants';
import numeral from 'numeral';

// ----------------------------------------------------------------------

AgentSavings.getLayout = function getLayout(page) {
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
        name: 'Amount',
        options: {
            filter: false
        }
    },
    {
        name: 'Date Saved',
        options: {
            filter: false
        }
    },
    {
        name: 'Status',
        options: {
            customBodyRender: status => <Label color={status.toUpperCase() === PENDING ? 'warning' : status == APPROVED ? 'success' : 'danger'}>{status ?? "ACTIVE"}</Label>
        }
    },
    {
        name: '',
        options: {
            filter: false,
            sort: false
        }
    },
]



export default function AgentSavings() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [savings, setSavings] = useState([]);

    const [activeUser, setActiveUser] = useState(null);

    const [farmerPhoneNumber, setFarmerPhoneNumber] = useState('');

    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

    const [amountToSave, setAmountToSave] = useState(0)

    const [proofOfPayment, setProofOfPayment] = useState(null);

    const [activeProof, setActiveProof] = useState(null);

    const fetchInitialData = async () => {
        try {
            const res = await SavingService.getAgentSavings(user?.id);
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

    const handleCancelAddMoney = () => {
        setShowAddMoneyModal(false)
        setActiveUser(null);
        setAmountToSave(0);
        setProofOfPayment(null)
    }

    const { enqueueSnackbar } = useSnackbar()

    const { themeStretch } = useSettings();

    const handlePhoneNumberChange = async (e) => {
        const phoneNumber = e.target.value;

        if (phoneNumber.length === 11) {
            try {
                setLoading(true)
                const res = await UserService.findUserByPhoneNumber(phoneNumber);
                setActiveUser(res.data?.data)
            } catch (error) {
                return enqueueSnackbar(APIErrorHandler(error), {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }
                })
            } finally {
                setLoading(false)

                setFarmerPhoneNumber(phoneNumber)
            }
        }

        setFarmerPhoneNumber(phoneNumber)
    }

    const handleProofOfPaymentChange = e => {
        const file = e.target.files[0];
        setProofOfPayment(file);
    }


    const handleAmountToSaveChange = (e) => {
        const { value } = e.target;

        if (value < 0) return setAmountToSave(0);

        return setAmountToSave(value);
    }

    const handleCompleteAddMoney = async () => {
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
        formData.append('user_id', activeUser?.id);

        try {
            setLoading(true)
            const res = await SavingService.agentUploadSaving(formData);

            setProofOfPayment(null);
            enqueueSnackbar("Money has been requested. Fund will be credited after verification. Please wait", {
                variant: 'success',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                }
            });

            setSavings(prev => [
                res.data?.data,
                ...prev
            ]);

            handleCancelAddMoney()

        } catch (error) {
            return enqueueSnackbar(APIErrorHandler(error), {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Page title="Dashboard:">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Third Party Savings"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Agent', href: '' },
                        { name: 'Savings' },
                    ]}
                    action={<Button onClick={() => setShowAddMoneyModal(true)} variant='contained'>Add Money</Button>}
                />

                <Grid container spacing={3}>

                    <Grid item xs={12} m='0 auto'>
                        <MUIDataTable
                            title={loading ? <CircularProgress /> : null}
                            columns={TABLE_COLUMNS}
                            data={savings.map((saving, index) => ([
                                index + 1,
                                formatName(saving?.user),
                                numeral(saving?.amount).format('0,0.00'),
                                moment(saving?.created_at).format('D-M-YYYY'),
                                saving?.status,
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => setActiveProof(saving?.proof_upload_url)}
                                    size='small'>View Proof</Button>,

                            ]))}
                            options={{
                                elevation: 0,
                                selectableRows: 'none'
                            }}
                        />
                    </Grid>

                </Grid>

                <Dialog open={showAddMoneyModal} onClose={handleCancelAddMoney} fullWidth>
                    <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='h4' color='primary'>
                            Add Money | {activeUser && formatName(activeUser)}
                        </Typography>
                        <Typography variant='h4' color='primary'>
                            {loading && <CircularProgress color='primary' />}
                        </Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <TextField fullWidth placeholder='Enter Phone Number' value={farmerPhoneNumber} onChange={handlePhoneNumberChange} disabled={loading} />

                        {
                            activeUser && <>
                                <Grid xs={12}>
                                    <Typography>
                                        Please pay to any of the accounts below and upload proof of payment.
                                    </Typography>


                                    <List sx={{ backgroundColor: '#458945', borderRadius: '1rem', margin: '1rem 0' }}>
                                        <ListItem>
                                            <Typography mt={2} color='white' variant='h6'>
                                                <strong>Account Name:</strong> Wirex Global Ventures
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant='body' color='white'>
                                                2000146428 - FCMB
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant='body' color='white'>
                                                0088698769 - Sterling Bank
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid xs={12} >
                                    <Typography variant='body2'>Amount to credit</Typography>
                                    <TextField
                                        fullWidth
                                        value={amountToSave}
                                        onChange={handleAmountToSaveChange}
                                        type='number'
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
                                <Grid xs={12}>
                                    <Typography color='error' my={1}>Please note that proof of payment needs to be confirmed before credit would reflect on your account</Typography>
                                </Grid>
                            </>
                        }
                    </DialogContent>
                    <DialogActions>
                        {activeUser && <Button onClick={handleCompleteAddMoney} variant='contained'>Confirm</Button>}
                    </DialogActions>
                </Dialog>
            </Container>
            <Dialog open={activeProof} fullWidth onClose={() => setActiveProof(null)}>
                <DialogTitle>Proof</DialogTitle>
                <Divider />
                <DialogContent>
                    <img src={`${getHostAPIBase()}${activeProof}`} />
                </DialogContent>
            </Dialog>
        </Page>
    );
}
