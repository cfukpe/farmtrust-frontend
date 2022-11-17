// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

export const appNavConfig = {
  FARMER: [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'Navigation',
      items: [
        { title: 'Savings', path: PATH_DASHBOARD.shared.savings, icon: ICONS.dashboard },
        { title: 'Investments', path: PATH_DASHBOARD.farmer.loans, icon: ICONS.ecommerce },
        { title: 'Trust Loan', path: PATH_DASHBOARD.farmer.loans, icon: ICONS.ecommerce },
        // { title: 'Farm Management', path: PATH_DASHBOARD.farmer.farmManagement, icon: ICONS.analytics },
        { title: 'Food bank', path: PATH_DASHBOARD.farmer.foodbank, icon: ICONS.banking },
        { title: 'Withdrawals', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
      ],
    },
  ],
  BUYER: [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'Navigation',
      items: [
        { title: 'Savings', path: PATH_DASHBOARD.shared.savings, icon: ICONS.dashboard },
        // { title: 'Trust Loan', path: PATH_DASHBOARD.farmer.loans, icon: ICONS.ecommerce },
        { title: 'Investments', path: PATH_DASHBOARD.farmer.farmManagement, icon: ICONS.analytics },
        { title: 'Food bank', path: PATH_DASHBOARD.farmer.foodbank, icon: ICONS.banking },
        { title: 'Withdrawals', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
      ],
    },
  ],
  AGENT: [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'Navigation',
      items: [
        { title: 'Savings', path: PATH_DASHBOARD.shared.savings, icon: ICONS.dashboard },
        { title: 'Farm Management', path: PATH_DASHBOARD.farmer.farmManagement, icon: ICONS.analytics },
        { title: 'Food bank', path: PATH_DASHBOARD.farmer.foodbank, icon: ICONS.banking },
        { title: 'Withdrawals', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
        { title: 'Managed Farmers', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
      ],
    },
  ],
  ADMIN: [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'Navigation',
      items: [
        { title: 'All Users', path: PATH_DASHBOARD.shared.savings, icon: ICONS.dashboard },
        { title: 'All Products', path: PATH_DASHBOARD.farmer.loans, icon: ICONS.ecommerce },
        { title: 'All Investments', path: PATH_DASHBOARD.farmer.farmManagement, icon: ICONS.analytics },
        { title: 'All Food Banks', path: PATH_DASHBOARD.farmer.foodbank, icon: ICONS.banking },
        { title: 'All Savings', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
        { title: 'Loans Management', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
      ],
    },
  ],
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Navigation',
    // items: [
    //   { title: 'Savings', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    //   { title: 'Loan', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
    //   { title: 'Farm Management', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
    //   { title: 'Products', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
    //   { title: 'Withdrawals', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
    // ],
    items: [
      { title: 'Savings', path: PATH_DASHBOARD.shared.savings, icon: ICONS.dashboard },
      { title: 'Trust Loan', path: PATH_DASHBOARD.farmer.loans, icon: ICONS.ecommerce },
      { title: 'Farm Management', path: PATH_DASHBOARD.farmer.farmManagement, icon: ICONS.analytics },
      { title: 'Food bank', path: PATH_DASHBOARD.farmer.foodbank, icon: ICONS.banking },
      { title: 'Withdrawals', path: PATH_DASHBOARD.shared.withdrawals, icon: ICONS.booking },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     // USER
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'profile', path: PATH_DASHBOARD.user.profile },
  //         { title: 'cards', path: PATH_DASHBOARD.user.cards },
  //         { title: 'list', path: PATH_DASHBOARD.user.list },
  //         { title: 'create', path: PATH_DASHBOARD.user.new },
  //         { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
  //         { title: 'account', path: PATH_DASHBOARD.user.account },
  //       ],
  //     },

  //     // E-COMMERCE
  //     {
  //       title: 'e-commerce',
  //       path: PATH_DASHBOARD.eCommerce.root,
  //       icon: ICONS.cart,
  //       children: [
  //         { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
  //         { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
  //         { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
  //         { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
  //         { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
  //         { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
  //       ],
  //     },

  //     // INVOICE
  //     {
  //       title: 'invoice',
  //       path: PATH_DASHBOARD.invoice.root,
  //       icon: ICONS.invoice,
  //       children: [
  //         { title: 'list', path: PATH_DASHBOARD.invoice.list },
  //         { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
  //         { title: 'create', path: PATH_DASHBOARD.invoice.new },
  //         { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
  //       ],
  //     },

  //     // BLOG
  //     {
  //       title: 'blog',
  //       path: PATH_DASHBOARD.blog.root,
  //       icon: ICONS.blog,
  //       children: [
  //         { title: 'posts', path: PATH_DASHBOARD.blog.posts },
  //         { title: 'post', path: PATH_DASHBOARD.blog.demoView },
  //         { title: 'create', path: PATH_DASHBOARD.blog.new },
  //       ],
  //     },
  //   ],
  // },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: (
  //         <Label variant="outlined" color="error">
  //           +32
  //         </Label>
  //       ),
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
  //   ],
  // },
];

export default navConfig;
