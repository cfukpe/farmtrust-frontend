import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from '../assets';

export const SAVINGS = "Savings";
export const LOAN = "Loan";
export const FOOD_BANK = "Food Bank";

// ----------------------------------------------------------------------

const LICENSES = [SAVINGS, LOAN, FOOD_BANK];

export const _homePlans = [...Array(3)].map((_, index) => ({
  license: LICENSES[index],
  commons: ['One end products', '12 months updates', '6 months of support'],
  options: {
    [SAVINGS]: [
      'Trust Flexi: Save what you want when you want',
      `Trust Target: Set a target to meet and let's help you acheive that`,
      `Trust Fixed: Have money you don't want to use for a while, let's help you keep that and grow interest`,
    ],
    [LOAN]: [
      'TRUST INPUT LOANS',
      'TRUST FARM LOANS',
      'TRUST EQUIPMENT LOANS',
      'TRUST COMMODITY LOANS',
    ],
    [FOOD_BANK]: [
      'Save as little as #200 daily',
      'Get access to fresh food',
      // 'Design Resources',
      // 'Commercial applications',
    ],
  },
  icon: {
    Savings: "il:money",
    Loan: "game-icons:receive-money",
    "Food Bank": "fluent:savings-16-filled"
  },
  icons: [
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_sketch.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_figma.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_js.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_ts.svg',
  ],
}));

export const _pricingPlans = [
  {
    subscription: 'basic',
    icon: <PlanFreeIcon />,
    price: 0,
    caption: 'forever',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: false },
      { text: 'Advanced security', isAvailable: false },
      { text: 'Permissions & workflows', isAvailable: false },
    ],
    labelAction: 'current plan',
  },
  {
    subscription: 'starter',
    icon: <PlanStarterIcon />,
    price: 4.99,
    caption: 'saving $24 a year',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: true },
      { text: 'Advanced security', isAvailable: false },
      { text: 'Permissions & workflows', isAvailable: false },
    ],
    labelAction: 'choose starter',
  },
  {
    subscription: 'premium',
    icon: <PlanPremiumIcon />,
    price: 9.99,
    caption: 'saving $124 a year',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true },
    ],
    labelAction: 'choose premium',
  },
];
