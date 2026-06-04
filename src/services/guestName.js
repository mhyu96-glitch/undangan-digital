export const getGuestNameFromUrl = (defaultName) => {
  const params = new URLSearchParams(window.location.search);
  return params.get('to') || defaultName;
};
