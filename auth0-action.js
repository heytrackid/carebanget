// Auth0 Action untuk menambahkan role claim ke JWT
// Setup di Auth0 Dashboard → Actions → Flows → Post Login

exports.onExecutePostLogin = async (event, api) => {
  // Tambahkan role 'authenticated' ke access token
  api.accessToken.setCustomClaim('role', 'authenticated');

  // Optional: Tambahkan role ke ID token juga jika diperlukan
  api.idToken.setCustomClaim('role', 'authenticated');
};
