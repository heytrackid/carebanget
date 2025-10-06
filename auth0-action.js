// Auth0 Action: Add Supabase Role Claim
// Setup di Auth0 Dashboard → Actions → Flows → Post Login
// Dokumentasi: https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims

exports.onExecutePostLogin = async (event, api) => {
  try {
    // Tambahkan role claim ke access token untuk Supabase authentication
    // Supabase akan menggunakan role 'authenticated' untuk database access
    api.accessToken.setCustomClaim('role', 'authenticated');

    // Optional: Tambahkan role ke ID token juga (untuk client-side usage)
    api.idToken.setCustomClaim('role', 'authenticated');

    // Log successful role assignment
    console.log(`✅ Auth0 Action: Added role=authenticated for user ${event.user.email}`);

  } catch (error) {
    // Log error tapi jangan fail authentication
    console.error('❌ Auth0 Action Error:', error);
  }
};
