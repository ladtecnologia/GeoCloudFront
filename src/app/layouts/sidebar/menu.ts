import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },

  {
    id: 2,
    label: 'GeoCloudAI',
    icon: 'ri-apps-2-line',
    subItems: [
      {
        id: 3,
        label: 'Users',
        link: '/pages/users',
        parentId: 2
      },
      {
        id: 4,
        label: 'Accounts',
        link: '/pages/accounts',
        parentId: 2
      },
      
    ]
  },  
  
];
