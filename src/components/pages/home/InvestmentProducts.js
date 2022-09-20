import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React from 'react'
import Iconify from 'src/components/Iconify'

const products = [
    {
        product: "Rice Grain",
        farm: "Chinedu Farms Limited",
        location: "Lokogoma, Abuja"
    },
    {
        product: "Maize ",
        farm: "Hulugh Farms Limited",
        location: "Gwer West, Benue"
    },
    {
        product: "Rice Grain",
        farm: "Hart Global",
        location: "Idu, Abuja"
    },
    {
        product: "Cassava flour",
        farm: "Hanzzo JGL",
        location: "Idumota Lagos"
    },
    {
        product: "Rice Grain",
        farm: "Chinedu Farms Limited",
        location: "Lokogoma, Abuja"
    },
]

export default function InvestmentProducts() {
    return (
        <div>
            <Grid container maxWidth='1000px' margin='0 auto'>
                <Typography
                    textAlign='center'
                    fontSize={'18pt'}
                    display='block'
                    width='100%'
                    color="#459834"
                    my={2}
                    component='h1'>
                    Products
                </Typography>
            </Grid>
            <Grid container maxWidth='1000px' margin='0 auto'>
                {
                    products.map((product, index) => {
                        return (<Card key={index} sx={{ mb: 3 }} style={{ margin: '1rem' }}>
                            <CardHeader
                                title={product.product}
                            // action={

                            // }
                            />
                            <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                    {/* {billing?.receiver}&nbsp; */}
                                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                        {product.farm}
                                    </Typography>
                                </Typography>

                                <Typography color='#236623' variant="body2" gutterBottom>
                                    <Iconify icon={'mdi:cash-marker'} />
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {product.location}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    <Button variant='contained' style={{ marginTop: '1rem' }} size="small" startIcon={<Iconify icon={'ic:round-money'} />}>
                                        Invest
                                    </Button>
                                </Typography>
                            </CardContent>
                        </Card>)

                    })
                }
            </Grid>
        </div>
    )
}
