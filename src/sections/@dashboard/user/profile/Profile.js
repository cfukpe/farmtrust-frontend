import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import useAuth from 'src/hooks/useAuth';
import ProfileFarmAbout from './ProfileFarmAbout';
import ProfilePassword from './ProfilePassword';

// ----------------------------------------------------------------------

Profile.propTypes = {
  myProfile: PropTypes.object,
  posts: PropTypes.array,
};

export default function Profile({ myProfile, posts }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <ProfileAbout profile={myProfile} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <ProfilePassword profile={myProfile} />
        </Stack>
      </Grid>
      {myProfile.farm && <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <ProfileFarmAbout profile={myProfile} />
        </Stack>
      </Grid>}
    </Grid>
  );
}
