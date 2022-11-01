import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
// next
import NextLink from 'next/link';
// @mui
import { Box, Card, Link, Typography, Stack, Button, Dialog, DialogTitle, TextField, DialogActions, Input } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';
import { useState } from 'react';
import Avatar from 'src/theme/overrides/Avatar';
import { usePaystackPayment } from 'react-paystack';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { package_name, package_image_url, unit_price, colors, status, priceSale } = product;

  const linkTo = PATH_DASHBOARD.eCommerce.view(paramCase(name));

  const [showInvestModal, setShowInvestModal] = useState(false);
  const [quantity, setQuantity] = useState(1)

  const onQuantityChange = (e) => {
    const { value } = e.target;
    if (value < 1) return;

    setQuantity(value);
  }

  const user = useAuth().user;

  const { enqueueSnackbar } = useSnackbar();

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: user?.email,
    amount: (quantity * unit_price) * 100,
    publicKey: process.env.PAYSTACK_PK,
  };

  const initiatePayment = usePaystackPayment(paystackConfig);

  const initiateInvestmentPayment = () => {

    if (!user) {
      enqueueSnackbar("You are not logged in. Please login or create an account", {
        variant: 'warning'
      });

    }
    setShowInvestModal(false);
    initiatePayment(onPaymentSuccess, onPaymentCancel)
  }

  const onPaymentSuccess = async () => {

  }

  const onPaymentCancel = () => {
    setShowInvestModal(true);
  }

  const onCloseInvestment = () => {
    setQuantity(1);
    setShowInvestModal(false);
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <Image alt={package_name} src={package_image_url} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <NextLink href={linkTo} passHref>
          <Link color="inherit">
            <Typography variant="subtitle2" noWrap>
              {package_name}
            </Typography>
          </Link>
        </NextLink>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={[]} /> */}
          <Button variant='contained' color='primary'>Invest</Button>

          <Stack direction="row" spacing={0.5}>
            {priceSale && (
              <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(priceSale)}
              </Typography>
            )}

            <Typography variant="subtitle1">{fCurrency(unit_price)}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Dialog open={showInvestModal} fullWidth maxWidth="xs" onClose={onCloseInvestment}>
        <DialogTitle>Investment Setup</DialogTitle>

        <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar src={package_image_url} sx={{ width: 48, height: 48 }} /> */}
            <div>
              <Typography variant="subtitle2">{package_name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                you are about to invest in this package
              </Typography>
            </div>
          </Stack>

          <InputAmount
            onBlur={onQuantityChange}
            onChange={onQuantityChange}
            autoWidth={true}
            amount={quantity}
            disableUnderline={false}
            sx={{ justifyContent: 'flex-end' }}
          />

          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {fCurrency(quantity * unit_price)}
          </Typography>
        </Stack>
        <DialogActions>
          <Button variant="contained" disabled={quantity < 1} onClick={initiateInvestmentPayment}>
            Confirm Investment
          </Button>
          <Button onClick={onCloseInvestment}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}


function InputAmount({ autoWidth, amount, onBlur, onChange, sx, ...other }) {
  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={sx}>
      <Typography variant="h5">Qty</Typography>
      <Input
        disableUnderline
        size="small"
        value={amount}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{ step: 1, min: 0, max: 10000, type: 'number' }}
        sx={{
          typography: 'h3',
          '& input': {
            p: 0,
            textAlign: 'center',
            width: autoWidth,
          },
        }}
        {...other}
      />
    </Stack>
  );
}
