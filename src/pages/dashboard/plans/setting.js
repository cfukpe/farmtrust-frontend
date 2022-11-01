// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';
import FarmSettingForm from 'src/sections/@dashboard/farm/FarmSettingForm';

// ----------------------------------------------------------------------

FarmSetting.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function FarmSetting() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Farm: Farm Settings">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Hey! Setup your farm"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Farmer', href: PATH_DASHBOARD.root },
                        { name: 'Farm Setting' },
                    ]}
                />
                <FarmSettingForm />
            </Container>
        </Page>
    );
}
