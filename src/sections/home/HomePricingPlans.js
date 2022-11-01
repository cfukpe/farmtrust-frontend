import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Card, Link, Stack, Button, Divider, Container, Typography } from '@mui/material';
// _mock_
import { _homePlans } from '../../_mock';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import { varFade, MotionViewport } from '../../components/animate';
import { PATH_PAGE } from 'src/routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

export default function HomePricingPlans() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <m.div variants={varFade().inUp}>
            <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
              Our Services
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Register for one or more services
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{
                color: isLight ? 'text.secondary' : 'text.primary',
              }}
            >
              Choose the service that suites your need.
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={5}>
          {_homePlans.map((plan) => (
            <Grid key={plan.license} item xs={12} md={4}>
              <m.div variants={plan.license === 'Loan' ? varFade().inDown : varFade().inUp}>
                <PlanCard plan={plan} />
              </m.div>
            </Grid>
          ))}
        </Grid>

        {/* <m.div variants={varFade().in}>
          <Box sx={{ p: 5, mt: 10, textAlign: 'center' }}>
            <m.div variants={varFade().inDown}>
              <Typography variant="h3">Still have questions?</Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography sx={{ mt: 3, mb: 5, color: 'text.secondary' }}>
                Please describe your case to receive the most accurate advice.
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Button
                size="large"
                variant="contained"
                href="mailto:support@minimals.cc?subject=[Feedback] from Customer"
              >
                Contact us
              </Button>
            </m.div>
          </Box>
        </m.div> */}
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

PlanCard.propTypes = {
  plan: PropTypes.shape({
    license: PropTypes.string,
    commons: PropTypes.arrayOf(PropTypes.string),
    icons: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.string),
  }),
};

function PlanCard({ plan }) {
  const { license, commons, options, icons } = plan;

  const standard = license === 'Standard';
  const plus = license === 'Standard Plus';

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        ...(plus && {
          boxShadow: (theme) => theme.customShadows.z24,
        }),
      }}
    >
      <Stack spacing={5}>
        <div>
          <Typography variant="overline" component="div" sx={{ mb: 2, color: 'text.disabled' }}>
            SERVICE
          </Typography>
          <Typography variant="h4">{license}</Typography>
        </div>

        <Stack direction='column' spacing={1}>
          <Iconify icon={plan.icon[license]} sx={{
            fontSize: '2rem',
            textAlign: 'center',
            display: 'block',
            background: '#90df90',
            margin: '0 auto',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            maxWidth: '200px',

          }} />
        </Stack>
        <Stack spacing={2.5}>
          {/* {commons.map((option) => (
            <Stack key={option} spacing={1.5} direction="row" alignItems="center">
              <Iconify icon={'eva:checkmark-fill'} sx={{ color: 'primary.main', width: 20, height: 20 }} />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          ))} */}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {options[license].map((option, optionIndex) => {
            const disabledLine =
              (standard && optionIndex === 1) ||
              (standard && optionIndex === 2) ||
              (standard && optionIndex === 3) ||
              (plus && optionIndex === 3);

            return (
              <Stack
                spacing={1.5}
                direction="row"
                alignItems="center"
                sx={{
                  ...(disabledLine && { color: 'text.disabled' }),
                }}
                key={option}
              >
                <Iconify
                  icon={'eva:checkmark-fill'}
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'primary.main',
                    ...(disabledLine && { color: 'text.disabled' }),
                  }}
                />
                <Typography variant="body2">{option}</Typography>
              </Stack>
            );
          })}
        </Stack>

        <Button
          size="large"
          fullWidth
          variant={plus ? 'contained' : 'outlined'}
          // target="_blank"
          rel="noopener"
          href={PATH_PAGE[license]}
        >
          See more
        </Button>
      </Stack>
    </Card>
  );
}
