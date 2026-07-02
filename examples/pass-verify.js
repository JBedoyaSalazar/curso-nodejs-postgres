import bcrypt from 'bcrypt';

/**
 * Demonstrates how bcrypt compares a plain text password with a stored hash.
 *
 * @returns {Promise<void>}
 */
export const verifyPassword = async () => {
  const password = 'myPassword123';
  const hash = "$2b$10$ExtO5EKm7UJRjaqO/JfDte/SgVoEBx4jz8B1ezjQ236O5ga835UTW"
  const isMatch = await bcrypt.compare(password, hash);
  console.log('Password Match:', isMatch);
}

verifyPassword();
