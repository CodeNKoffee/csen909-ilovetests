import type { Status } from './store';
export const statusText: Record<Status, string> = {
  due: 'Not handed in', submitted: 'Text to check', checked: 'Ready to grade', drafted: 'Draft by assistant', confirmed: 'Confirmed', released: 'Released',
};
