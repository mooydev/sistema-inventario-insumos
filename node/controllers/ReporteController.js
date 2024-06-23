import InsumoModel from "../models/InsumoModel.js";
import moment from 'moment';

// export const getReporteDiario = async (fecha, res) => {
//     try {
//         const inicioDeOperacion = '2024-05-01';
//         const fechaDeInicio = moment(inicioDeOperacion).format('YYYY-MM-DD');
//         const inputFecha = moment(fecha).format('YYYY-MM-DD');
//         const hoy = moment().startOf("day");
//         if (inputFecha.isAfter(hoy)) {
//             return console.log("La fecha dada no tiene registros aún.")
//         }
//         if (inputFecha.isBefore(fechaDeInicio)) {
//             return console.log("La fecha proporciona es anterior al inicio de operaciones")
//         }
//         const movimientosDiarios = await InsumoModel.findAll({
//             where: {
//                 updatedAt: parametroFecha
//             }
//         })
//         res.json({ message: "Insumos con moviento de fecha " + inputFecha, Insumos :  movimientosDiarios });
//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };