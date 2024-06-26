import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Chip } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  profile: PropTypes.object,
  user: PropTypes.object,
};

export default function ProfileAbout({ profile, user }) {
  const { quote, country, email, role, company, school } = profile;
  console.log(user)
  return (
    <Card>
      <CardHeader title="Basic Detail" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2"> Account Type: {profile?.role}</Typography>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Name: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {profile?.last_name} {profile.first_name}
            </Link>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{profile?.email}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Account Type: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {profile?.role}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <Chip color={profile?.status?.toLowerCase() == 'active' ? 'success' : 'error'} label={profile?.status} />
        </Stack>
      </Stack>
    </Card>
  );
}
