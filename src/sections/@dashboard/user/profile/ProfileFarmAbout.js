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

ProfileFarmAbout.propTypes = {
  profile: PropTypes.object,
  user: PropTypes.object,
};

export default function ProfileFarmAbout({ profile }) {
  const { quote, country, email, role, company, school } = profile;
  return (
    <Card>
      <CardHeader title="Other Information" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2"> Farm Name:</Typography>
        <Typography variant="h5" color='primary'>{profile?.farm?.farm_name}</Typography>
        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2" sx={{ display: 'block' }}>
            Farm Address: &nbsp;
          </Typography>
          <Typography variant="body2">
            <Link component="span" variant="subtitle2" color="text.primary">
              {profile?.farm?.farm_location}
            </Link>
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Farm State: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {profile?.farm?.farm_state}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Saving Plan : &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {profile?.savings_plan}
            </Link>
          </Typography>
        </Stack>


      </Stack>
    </Card>
  );
}
