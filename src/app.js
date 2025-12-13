// Cargar variables de entorno al inicio
import 'dotenv/config';

import { Servidor } from "./server/server.js";

const app = new Servidor()
app.listen()