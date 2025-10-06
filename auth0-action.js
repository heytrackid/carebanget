// Auth0 Action untuk menambahkan role claim ke JWT
// Setup di Auth0 Dashboard → Actions → Flows → Post Login
// Dokumentasi: https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims

exports.onExecutePostLogin = async (event, api) => {
  // Tambahkan role claim ke access token untuk Supabase authentication
  // Supabase akan menggunakan role 'authenticated' untuk database access
  api.accessToken.setCustomClaim('role', 'authenticated');

  // Optional: Tambahkan role ke ID token juga (untuk client-side usage)
  api.idToken.setCustomClaim('role', 'authenticated');

  console.log('Auth0 Action: Added role claim for user:', event.user.email);
};
