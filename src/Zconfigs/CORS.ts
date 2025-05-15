export const cors = {
  origin: ['https://ln08wd06-3000.brs.devtunnels.ms'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false, //esto es para que no se detenga en el preflight
  optionsSuccessStatus: 202, // esto es para que no devuelva el status 200
  credentials: true,
}