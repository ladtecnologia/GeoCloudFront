import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },

  // GEOCLOUDAI ********************************

  {
    id: 1001,
    label: 'GeoCloudAI',
    icon: ' ri-command-line',
    subItems: [
      {
        id: 1002,
        label: 'Deposits',
        link: '/pages/crm/deposits',
        parentId: 1001
      },
      {
        id: 1003,
        label: 'Users',
        link: '/pages/crm/users',
        parentId: 1001
      },
      {
        id: 1004,
        label: 'Users 2',
        link: '/pages/crm/users2',
        parentId: 1001
      },
      
    ]
  },  
  {
    id: 8,
    label: 'MENUITEMS.APPS.TEXT',
    icon: 'ri-apps-2-line',
    subItems: [
      {
        id: 31,
        label: 'MENUITEMS.APPS.LIST.CRM',
        parentId: 8,
        subItems: [
          {
            id: 32,
            label: 'MENUITEMS.APPS.LIST.CONTACTS',
            link: '/pages/crm/contacts',
            parentId: 31
          },
          {
            id: 33,
            label: 'MENUITEMS.APPS.LIST.COMPANIES',
            link: '/pages/crm/companies',
            parentId: 31
          },
        ]
      },
    ]
  }
 
];
