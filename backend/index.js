const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Servidor Backend iniciado con éxito`);
  console.log(`📍 Escuchando en el puerto: ${PORT}`);
  console.log(`🔗 URL local: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
