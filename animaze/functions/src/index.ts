import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Placeholder function or keep other backend logic here
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Typotamus!");
});