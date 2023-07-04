// @mui
import { useTheme } from '@mui/material/styles';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,
MenuItem, Stack, styled, TextField, Typography } from '@mui/material';
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
// import { APIErrorHandler, getHostAPIBase } from 'src/utils/axios';
import Label from 'src/components/Label';
import { useSnackbar } from 'notistack';
import UserService from 'src/services/user.service';
import InvestmentService from 'src/services/investments.service';
import { FamilyRestroomOutlined } from '@mui/icons-material';
import Iconify from 'src/components/Iconify';
import axiosInstance, { APIErrorHandler } from 'src/utils/axios';
// ----------------------------------------------------------------------

UserSavings.getLayout = function getLayout(page) {
return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

const TABLE_COLUMNS = [
{
name: '#',
}, {
name: 'Category Name',
},
{
name: 'Description',
options: {
filter: false
}
},
// {
// name: 'Role',
// options: {
// filter: false
// }
// },
// {
// name: 'Registration Date',
// options: {
// filter: false
// }
// },
{
name: 'Status',
options: {
// customBodyRender: status => <Label color={status.toUpperCase()===PENDING ? 'warning' : status==APPROVED ? 'success'
    // : 'danger' }>{status ?? "ACTIVE"}</Label>
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

export default function UserSavings() {
const { user } = useAuth();

const [loading, setLoading] = useState(true);
const [users, setUsers] = useState([]);

const [showUpdateRole, setShowUpdateRole] = useState(false);
const [activeUser, setActiveUser] = useState(null);
const [selectedRole, setSelectedRole] = useState(null)
const [investment_categories, setInvestmentCategories] = useState([]);

// const [category_name, setCategoryName] = useState(null)

const fetchInitialData = async () => {
try {
const res = await InvestmentService.getAllInvestmentCategories();
const data = res.data?.data?.data;
if (Array.isArray(data)) {
setInvestmentCategories(data);
} else {
console.log("Invalid investment categories data");
}
console.log(data);
} catch (e) {
console.log(e);
} finally {
setLoading(false);
}
};

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

const [showInvestmentDialog, setShowInvestmentDialog] = useState(false)

const [categoryName, setCategoryName] = useState('');
const [categoryDescription, setCategoryDescription] = useState('');
const [status, setStatus] = useState('ACTIVE');

// const handleInvest = async () => {
const handleInvest = () => {
// Perform any necessary validation on the form data
const requestData = {
    ...formData,
    status: 'ACTIVE'
  };

// Send the form data to the endpoint using Axios
axiosInstance
.post('/investment-categories', requestData)
.then((response) => {
// Handle the successful response
console.log('Success:', response.data);
// Perform any necessary actions, such as showing a success message or redirecting
// ...
})
.catch((error) => {
// Handle the error response
console.error('Error:', error);
// Perform any necessary actions, such as showing an error message or logging the error
// ...
});
};

const [formData, setFormData] = useState({});
return (
<Page title="Dashboard:">
    <Container maxWidth={themeStretch ? false : 'xl' }>
        <HeaderBreadcrumbs heading="Investment Categories" links={[ { name: 'Dashboard' , href: PATH_DASHBOARD.root }, {
            name: 'Admin' , href: '' }, { name: 'Investment Categories' }, ]} />
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Button onClick={()=> setShowInvestmentDialog(true)}
                    color="success" variant='contained'>
                    New Investment Category
                    <Iconify icon='uil:money-add' color="#f89" /></Button>
            </Grid>
            <Grid item xs={12} m='0 auto'>
                <MUIDataTable title={loading ? <CircularProgress /> : null}
                columns={TABLE_COLUMNS}
                data={investment_categories.map((data, index) => ([
                index + 1,
                // formatName(data),
                data?.category_name,
                data?.category_description,
                // moment(user?.created_at).format('D-M-YYYY'),
                data?.status,
                <Button variant='contained' color='success' onClick={()=> handleShowUpdateUser(user)}
                    size='small'>Update Investment Category</Button>,

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
            <Typography variant='h4' color='primary'>Upd</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Typography variant='body2'>
                Name: {formatName(activeUser)}
            </Typography>
            <Typography variant='body2'>
                Current Role: {activeUser?.role}
            </Typography>
            <Typography variant='body2'>
                New Role: {selectedRole ?? "Unselected"}
            </Typography>
            <TextField onChange={(e)=> setSelectedRole(e.target.value)} style={{ marginTop: '1rem' }} select fullWidth
                placeholder='Select new role'>
                <MenuItem value={FARMER}>{FARMER}</MenuItem>
                <MenuItem value={AGENT}>{AGENT}</MenuItem>
            </TextField>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleUpdateUser}>Confirm {loading &&
                <CircularProgress />}</Button>
        </DialogActions>
    </Dialog>

    <Dialog open={showInvestmentDialog} onClose={()=> setShowInvestmentDialog(false)}>
        <DialogTitle>
            <Typography variant='h3' color='success'>
                Add Investment Category
            </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Grid container>

                {/* <Grid md={12} my={2}>
                    <TextField select label='Select Status' fullWidth value={'ACTIVE'}
                        onChange={(e)=> setFormData({ ...formData, status: e.target.value })}
                        >
                        <option >ACTIVE</option>
                        <option>INACTIVE</option>
                    </TextField>
                </Grid> */}

                {/* <Grid md={12}>
                    <TextField label='Status' fullWidth value={formData.status || '' }
                        onChange={(e)=> setFormData({ ...formData, status: e.target.value })}
                    
                        />
                </Grid> */}

                <Grid md={12}>
                    <TextField label='Category Name' fullWidth value={formData.investment_category_name || '' }
                        onChange={(e)=> setFormData({ ...formData, investment_category_name: e.target.value })}
                        />
                </Grid>

                <Grid md={12} my={2}>
                    <TextField label='Category Description' fullWidth value={formData.investment_category_description || '' }
                        onChange={(e)=> setFormData({ ...formData, investment_category_description: e.target.value })}

                        />
                </Grid>

                <Grid xs={12}>
                    <Typography color='error' my={1} variant='body2'>By investing, you agree to our terms and conditions
                    </Typography>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button variant='contained' onClick={handleInvest}>Invest</Button>
        </DialogActions>
    </Dialog>

</Page>
);
}