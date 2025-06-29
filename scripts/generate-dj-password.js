const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate password hash
const generatePasswordHash = async (customPassword) => {
  const password = customPassword || crypto.randomBytes(8).toString('hex');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log('\x1b[32m%s\x1b[0m', 'Generated DJ credentials:');
  console.log('\x1b[33m%s\x1b[0m', `Password: ${password}`);
  console.log('\x1b[36m%s\x1b[0m', `Password Hash: ${hash}`);
  console.log('\n\x1b[31m%s\x1b[0m', 'IMPORTANT: Save these credentials securely. The password cannot be recovered once lost.');
  console.log('\x1b[37m%s\x1b[0m', 'Add the following to your .env file:');
  console.log('\x1b[37m%s\x1b[0m', `DJ_PASSWORD_HASH=${hash}`);
  
  // Only generate new JWT_SECRET if it's not already set
  if (!process.env.JWT_SECRET) {
    console.log('\x1b[37m%s\x1b[0m', `JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`);
  }
};

// Get password from command line argument
const customPassword = process.argv[2];
if (!customPassword) {
  console.log('\x1b[31m%s\x1b[0m', 'Please provide a password as a command line argument:');
  console.log('\x1b[37m%s\x1b[0m', 'Example: node scripts/generate-dj-password.js myNewPassword');
  process.exit(1);
}

generatePasswordHash(customPassword); 