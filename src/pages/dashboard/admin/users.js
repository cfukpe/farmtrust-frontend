// @mui
import { useTheme } from '@mui/material/styles';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Stack, styled, TextField, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
// sections
import { useEffect, useState } from 'react';
import { AGENT, APPROVED, FARMER, PENDING } from 'src/utils/constants';
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
import UserService from 'src/services/user.service';
import { FamilyRestroomOutlined } from '@mui/icons-material';

// ----------------------------------------------------------------------

UserSavings.getLayout = function getLayout(page) {
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
        name: 'Email',
        options: {
            filter: false
        }
    },
    {
        name: 'Role',
        options: {
            filter: false
        }
    },
    {
        name: 'Registration Date',
        options: {
            filter: false
        }
    },
    {
        name: 'Status',
        options: {
            // customBodyRender: status => <Label color={status.toUpperCase() === PENDING ? 'warning' : status == APPROVED ? 'success' : 'danger'}>{status ?? "ACTIVE"}</Label>
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



export default function UserSavings() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const [showUpdateRole, setShowUpdateRole] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null)

    const fetchInitialData = async () => {
        try {
            const res = await UserService.getAllUsers();
            setUsers(res.data?.data)
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


    const { themeStretch } = useSettings();

    const handleShowUpdateUser = user => {
        setActiveUser(user);
        setShowUpdateRole(true)
    }


    const handleCloseUpdateUser = () => {
        setActiveUser(null);
        setShowUpdateRole(false)
    }

    const handleUpdateUser = async () => {
        try {
            setLoading(true)

            activeUser.role = selectedRole;

            const res = await UserService.updateUser(activeUser?.id, activeUser);
            setUsers(prev => prev.map(user => {
                if (user?.id === activeUser?.id) {
                    return res.data?.data
                }
                return user
            }))
            setActiveUser(null)
            setSelectedRole(null)
            setShowUpdateRole(false)
        } catch (e) {
            return enqueueSnackbar()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Page title="Dashboard:">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="System User Management"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Admin', href: '' },
                        { name: 'Users' },
                    ]}
                />
                <Grid container spacing={3}>

                    <Grid item xs={12} m='0 auto'>
                        <MUIDataTable
                            title={loading ? <CircularProgress /> : null}
                            columns={TABLE_COLUMNS}
                            data={users.map((user, index) => ([
                                index + 1,
                                formatName(user),
                                user?.email,
                                user?.role,
                                moment(user?.created_at).format('D-M-YYYY'),
                                user?.status,
                                <Button
                                    variant='contained'
                                    color='error'
                                    onClick={() => handleShowUpdateUser(user)}
                                    size='small'>Update</Button>,

                            ]))}
                            options={{
                                elevation: 0,

                            }}
                        />
                    </Grid>

                </Grid>
            </Container>

            <Dialog open={showUpdateRole} onClose={handleCloseUpdateUser} fullWidth>
                <DialogTitle>
                    <Typography variant='h4' color='primary'>Update User</Typography>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant='body2' >
                        Name: {formatName(activeUser)}
                    </Typography>
                    <Typography variant='body2' >
                        Current Role: {activeUser?.role}
                    </Typography>
                    <Typography variant='body2' >
                        New Role: {selectedRole ?? "Unselected"}
                    </Typography>
                    <TextField onChange={(e) => setSelectedRole(e.target.value)} style={{ marginTop: '1rem' }} select fullWidth placeholder='Select new role'>
                        <MenuItem value={FARMER}>{FARMER}</MenuItem>
                        <MenuItem value={AGENT}>{AGENT}</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleUpdateUser}>Confirm {loading && <CircularProgress />}</Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
}
