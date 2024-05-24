import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  MONGO_DB_URI: str(),
  PORT: port(),
  JWT_SECRET: str(),
});

export default env;
