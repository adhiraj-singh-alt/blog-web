import dotenv from 'dotenv';
import app from './app';

dotenv.config();
const APP_PORT = process.env.APP_PORT || 8080;

app.listen(APP_PORT, () => {
  console.log(`Server running on PORT : ${APP_PORT}`);
});
