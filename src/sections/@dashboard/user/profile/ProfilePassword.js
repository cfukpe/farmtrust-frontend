import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Chip, TextField, Button, CircularProgress } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { useState } from 'react';
import * as yup from 'yup'
import axiosInstance, { APIErrorHandler } from 'src/utils/axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfilePassword.propTypes = {
  profile: PropTypes.object,
  user: PropTypes.object,
};

export default function ProfilePassword({ profile, user }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const passwordFieldsInitialState = {
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: '',
    showPassword: false,
  }
  const passwordErrorsInitialState = {
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: '',
  }


  const [passwordFields, setPasswordFields] = useState(passwordFieldsInitialState);
  const [passwordErrors, setPasswordErrors] = useState(passwordErrorsInitialState);

  const { enqueueSnackbar } = useSnackbar()

  const passwordValidationShema = yup.object({
    currentPassword: yup.string("Current password must be a string").required("Current password is required").min(8, "Current password must be at least 8 characters"),
    newPassword: yup.string("New password must be a string").required("New password is required").min(8, "New password must be at least 8 characters"),
    passwordConfirmation: yup.string("Password confirmation is required").required("Password confirmation is required").min(8, "Password confirmation must be at least 8 characters"),
  })

  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    handlePasswordErrorChange(name, '')
    return setPasswordFields(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordErrorChange = (element, error) => {
    return setPasswordErrors(prev => ({
      ...prev,
      [element]: error
    }))
  }

  const handleChangePassword = async () => {

    passwordValidationShema.validate(passwordFields)
      .then(async (data) => {
        try {
          setIsChangingPassword(true)
          const { showPassword, ...changePasswordData } = passwordFields;
          const res = await axiosInstance.post('/user/change-password', changePasswordData);
          setPasswordErrors(passwordErrorsInitialState)
          setPasswordFields(passwordFieldsInitialState)
          enqueueSnackbar("Password changed success", {
            variant: 'success',
          })
        } catch (e) {
          console.log(e.message)
          enqueueSnackbar(APIErrorHandler(e), {
            variant: 'error'
          })
        } finally {
          setIsChangingPassword(false);
        }
      })
      .catch(error => handlePasswordErrorChange(error.path, error.message))


  }

  return (
    <Card>
      <CardHeader title="Change Password" />

      <Stack spacing={2} sx={{ p: 3 }}>

        <Stack direction="row">
          <TextField
            type='password'
            name='currentPassword'
            placeholder='Enter Current Password'
            fullWidth
            defaultValue={passwordFields.currentPassword}
            helperText={passwordErrors.currentPassword}
            error={passwordErrors.currentPassword}
            onBlur={handlePasswordFieldChange}
          />
        </Stack>

        <Stack direction="row">
          <TextField
            type='password'
            name='newPassword'
            placeholder='Enter New Password'
            fullWidth
            defaultValue={passwordFields.newPassword}
            onBlur={handlePasswordFieldChange}
            helperText={passwordErrors.newPassword}
            error={passwordErrors.newPassword}
          />
        </Stack>


        <Stack direction="row">

          <TextField
            type='password'
            name='passwordConfirmation'
            placeholder='Confirm New Password'
            fullWidth
            onBlur={handlePasswordFieldChange}
            defaultValue={passwordFields.passwordConfirmation}
            helperText={passwordErrors.passwordConfirmation}
            error={passwordErrors.passwordConfirmation}
          />
        </Stack>

        <Stack direction="row">
          <Button onClick={handleChangePassword} variant='contained' color='success' disabled={isChangingPassword} >Change Password {isChangingPassword && <CircularProgress />} </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
