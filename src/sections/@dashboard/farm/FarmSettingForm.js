import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
// next
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TableContainer, Table, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Divider, TableRow, TableCell, Checkbox, MenuItem } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries, nigerianStates } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Scrollbar from 'src/components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableMoreMenu, TableNoData } from 'src/components/table';
import { ProductTableRow } from '../e-commerce/product-list';
import Iconify from 'src/components/Iconify';
import { useSelector } from 'react-redux';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

FarmSettingForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
};


const TABLE_HEAD = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'farmName', label: 'Farm Name', align: 'left' },
    { id: '' },
];

const newMemberInitialState = {
    memberName: '',
    farmName: '',
    farmLocation: "",
    bvn: "",
}

export default function FarmSettingForm({ isEdit = false, currentUser }) {
    const { push } = useRouter();

    const [corporativeMembers, setCorporativeMembers] = useState([]);

    const [isCorporative, setIsCorporative] = useState(false);

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    const [corporativeMemberToRemove, setCorporativeMemberToRemove] = useState(null);

    const [newMember, setNewMember] = useState(newMemberInitialState);

    const investmentPackages = useSelector(state => state.investmentPackages);


    const { enqueueSnackbar } = useSnackbar();

    const NewFarmSchema = Yup.object().shape({
        farmName: Yup.string().required('Farm or company name is required'),
        state: Yup.string().required('Please select farm state'),
        farmCategory: Yup.string().required('Please select farm cagetory'),
        farmAddress: Yup.string().required('Please provide farm address'),
        avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
        // isCorporative: Yup.boolean().test(isCorporative, "You must register at least two corporative members", () => corporativeMembers.length < 2)
    });

    const defaultValues = useMemo(
        () => ({
            farmName: "",
            state: '',
            farmCategory: "",
            farmAddress: "",
            avatarUrl: ""
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [newMember]
    );

    const methods = useForm({
        resolver: yupResolver(NewFarmSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentUser) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentUser]);

    const onSubmit = async (form) => {
        form.isCorporative = isCorporative;
        form.corporativeMembers = corporativeMembers;


        if (isCorporative && corporativeMembers.length < 2) {

            return enqueueSnackbar('A corporative farm must have at least two members!', {
                variant: 'error',

            });
        }


        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const farmForm = new FormData();
            const res = await axiosInstance.post('/user/setting/farm', form);
            // reset();
            enqueueSnackbar('Update success!');
            push(`${PATH_DASHBOARD.root}/plans/completed`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                setValue(
                    'avatarUrl',
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
            }
        },
        [setValue]
    );

    const handleClose = () => {
        setShowAddMemberModal(false)
    };

    const handleAddMember = () => {

        return Yup.object().shape({
            memberName: Yup.string().required(),
            farmName: Yup.string().required(),
            farmLocation: Yup.string().required(),
            bvn: Yup.string().required().length(11),
        }).validate(newMember)
            .then(validatedData => {
                setCorporativeMembers(prev => [
                    ...prev,
                    validatedData,
                ]);
                setShowAddMemberModal(false);

                setNewMember(newMemberInitialState)
            })
            .catch(error => {
                return enqueueSnackbar(error?.errors[0], {
                    variant: 'error'
                })
            })
        setCorporativeMembers(prev => [
            ...prev,
            {
                memberName: ""
            }
        ]);
    }

    const handleMemberFieldChange = e => {
        const { value, name } = e.target;
        return setNewMember(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleIsCorporativeChange = () => {
        setNewMember(newMemberInitialState);
        setCorporativeMembers([])
        return setIsCorporative(prev => !prev)
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ py: 10, px: 3 }}>

                        <Typography textAlign='center' variant="subtitle2" sx={{ mb: 0.5 }}>
                            Upload Insurance document
                        </Typography>
                        {isEdit && (
                            <Label
                                color={values.status !== 'active' ? 'error' : 'success'}
                                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                            >
                                {values.status}
                            </Label>
                        )}

                        <Box sx={{ mb: 5 }}>
                            <RHFUploadAvatar
                                name="avatarUrl"
                                accept="image/*"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                placeholder="Upload Insurance"
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 2,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png
                                        <br /> max size of {fData(1024000)}
                                    </Typography>
                                }
                            />
                        </Box>

                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>

                        <Grid container spacing={1}>
                            <Grid item xs={12} mb={2}>
                                <RHFTextField name="farmName" label="Farm or Company Name" />
                            </Grid>
                            <Grid item xs={12} md={6} mb={2}>
                                <RHFSelect name="state" label="State" placeholder="State">
                                    <option value="" />
                                    {nigerianStates.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </RHFSelect>
                            </Grid>
                            <Grid item xs={12} md={6} mb={2}>
                                <RHFSelect name="farmCategory" label="Farm Package" placeholder="Category">
                                    <option value="" />
                                    {investmentPackages.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.package_name}
                                        </option>
                                    ))}
                                </RHFSelect>
                            </Grid>
                            <Grid item xs={12} mb={2}>
                                <RHFTextField name="farmAddress" label="Farm address" />
                            </Grid>
                            <Grid item xs={12} mb={2}>

                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    {...field}
                                                    checked={isCorporative}
                                                    onChange={handleIsCorporativeChange}
                                                />
                                            )}
                                        />
                                    }
                                    label={
                                        <>
                                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                Corporative
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Does your farm belong to a corporative?
                                            </Typography>
                                        </>
                                    }
                                    sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                                />
                            </Grid>
                            {isCorporative && <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 0.5 }} textAlign="center" >
                                    Register at least two members
                                </Typography>
                                <Scrollbar>
                                    <TableContainer sx={{ maxWidth: 800, marginBottom: "1rem" }} >


                                        <Table size={'small'}>
                                            <TableHeadCustom
                                                headLabel={TABLE_HEAD}
                                                rowCount={corporativeMembers.length}
                                                numSelected={0}
                                            />

                                            <TableBody>
                                                {
                                                    corporativeMembers.map((data, index) => {
                                                        return (
                                                            <TableRow hover >

                                                                <TableCell sx={{ alignItems: 'center' }}>
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {data.memberName}
                                                                    </Typography>
                                                                    <Typography variant="subtitle" noWrap>
                                                                        {data.bvn}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ alignItems: 'center' }}>
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {data.farmName}
                                                                    </Typography>
                                                                    <Typography variant="subtitle" noWrap>
                                                                        {data.farmLocation}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right" style={{ position: 'relative' }}>
                                                                    <TableMoreMenu
                                                                        open={corporativeMemberToRemove === index}
                                                                        onOpen={(handleOpenMenu) => setCorporativeMemberToRemove(index)}
                                                                        onClose={(handleCloseMenu) => setCorporativeMemberToRemove(null)}
                                                                        actions={
                                                                            <>
                                                                                <MenuItem
                                                                                    onClick={() => {
                                                                                        // onDeleteRow();
                                                                                        // handleCloseMenu();
                                                                                    }}
                                                                                    sx={{ color: 'error.main' }}
                                                                                >
                                                                                    <Iconify icon={'eva:trash-2-outline'} />
                                                                                    Remove
                                                                                </MenuItem>
                                                                            </>
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Scrollbar>
                                <LoadingButton
                                    onClick={() => setShowAddMemberModal(true)}
                                    type="button" variant="contained" loading={false}>
                                    Add Member
                                </LoadingButton>
                            </Grid>}
                        </Grid>

                        {/* <Box
                            sx={{
                                display: 'grid',
                                columnGap: 2,
                                rowGap: 3,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            <RHFTextField name="email" label="Email Address" />
                            <RHFTextField name="phoneNumber" label="Phone Number" />

                            <RHFSelect name="country" label="Country" placeholder="Country">
                                <option value="" />
                                {countries.map((option) => (
                                    <option key={option.code} value={option.label}>
                                        {option.label}
                                    </option>
                                ))}
                            </RHFSelect>

                            <RHFTextField name="state" label="State/Region" />
                            <RHFTextField name="city" label="City" />
                            <RHFTextField name="address" label="Address" />
                            <RHFTextField name="zipCode" label="Zip/Code" />
                            <RHFTextField name="company" label="Company" />
                            <RHFTextField name="role" label="Role" />
                        </Box> */}

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Complete Setup
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={showAddMemberModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add Corporative Member"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container minWidth={'400px'}>
                        <Grid item xs={12} mb={1}>
                            <RHFTextField
                                name="memberName"
                                label="Member Name"
                                onChange={handleMemberFieldChange}
                                value={newMember.memberName}
                            />
                        </Grid>
                        <Grid item xs={12} mb={1}>
                            <RHFTextField
                                name="farmName"
                                label="Farm Name"
                                onChange={handleMemberFieldChange}
                                value={newMember.farmName}
                            />
                        </Grid>
                        <Grid item xs={12} mb={1}>
                            <RHFTextField
                                name="farmLocation"
                                label="Farm Location"
                                onChange={handleMemberFieldChange}
                                value={newMember.farmLocation}
                            />
                        </Grid>
                        <Grid item xs={12} mb={1}>
                            <RHFTextField
                                name="bvn"
                                label="BVN"
                                onChange={handleMemberFieldChange}
                                value={newMember.bvn}
                            />
                        </Grid>
                    </Grid>
                    {/* <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAddMember}
                        autoFocus>
                        Add Member
                    </Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    );
}
