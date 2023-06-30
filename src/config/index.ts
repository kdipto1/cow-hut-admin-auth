import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_SECRET_EXPIRES,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_secret_expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES,
  },
};
