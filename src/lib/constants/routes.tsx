const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  WELCOME: 'Welcome',
  PROPERTIES: 'Properties',
  TENANTS: 'Tenants',
  PAYMENTS: 'Payments',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  MYCONTRACT: 'MyContract',
  ADDTENANT: 'AddTenant',
  MY_SUBSCRIPTION: 'MySubscription',
  ADD_PROPERTY: 'AddProperty',
  ADD_UNIT: 'AddUnit',
  UNIT_DETAILS: 'UnitDetails',
  PROPERTY_DETAILS: 'PropertyDetails',
  ADDCONTRACT: 'AddContract',
  NEWSCHEDUAL: 'NewSchedual',
  SCHEDULE_OF_PAYMENTS: 'ScheduleOfPayments',
} as const;

export type TRoutes = (typeof ROUTES)[keyof typeof ROUTES];
export default ROUTES;
