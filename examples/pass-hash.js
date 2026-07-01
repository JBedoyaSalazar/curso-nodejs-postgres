import bcrypt from 'bcrypt';

export const hashPassword = async () => {
  const password = 'myPassword123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();
