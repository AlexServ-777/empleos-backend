export const cors = {
  origin: ['http://localhost:3000', 'http://192.168.0.6:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false, //esto es para que no se detenga en el preflight
  optionsSuccessStatus: 200, // esto es para que no devuelva el status 200
  credentials: true,
}