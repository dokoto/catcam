export const INIT_APP = 'INIT_APP';

export default function initApp(date) {
  return {
    type: INIT_APP,
    date,
  };
}
