import { Op, Sequelize } from "sequelize";
import InsumoModel from "../models/InsumoModel.js";
import { createEntrada, createEntradaRecord } from "./EntradaController.js";
import { createSalida, createSalidaRecord } from "./SalidaController.js"
import moment from 'moment-timezone';
import EntradaModel from "../models/EntradaModel.js";
import SalidaModel from "../models/SalidaModel.js";


export const getInsumosCantMin = (insumos) => {
    const insumosCantMin = [];
    insumos.forEach(element => {
        if (element.cantidadExistente <= element.cantidadMinRequerida) {
            insumosCantMin.push(element)
        }
    })
    return insumosCantMin;
}

export const getInsumos = async (req, res) => {
    try {
        const insumos = await InsumoModel.findAll();
        const insumosCantMin = getInsumosCantMin(insumos);
        if (!insumosCantMin.length === 0) {
            return res.json({ insumos });
        }
        return res.json({ message: 'Existen insumos con existencia minima', insumos, insumosCantMin });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const getInsumo = async (req, res) => {
    try {
        const insumo = await InsumoModel.findAll({
            where: { insumoId: req.params.id }
        })
        return res.json(insumo);
    } catch (error) {
        return res.json({ message: error.message })
    }
}

export const crearInsumo = async (req, res) => {
    try {
        const { nombre } = req.body.nombre;
        const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
        if (!regex.test(nombre)) {
            return res.status(400).json({
                message: 'Los campos solo deben contener letras del alfabeto español y no signos especiales',
            });
        }
        const insumo = await InsumoModel.create(req.body);
        const entradaData = {
            insumoId: insumo.insumoId,
            nombre: insumo.nombre,
            cantidadEntrante: insumo.cantidadExistente,
            unidadMedida: insumo.unidadMedida
        }
        const nuevaEntrada = await createEntradaRecord(entradaData);
        return res.status(200).json({ message: 'Insumo creado correctamente', insumo });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const eliminarInsumo = async (req, res) => {
    try {
        const insumo = await InsumoModel.findOne({
            where: { insumoId: req.params.id }
        })
        if (!insumo) {
            return res.status(404).json({ message: 'El insumo no se encontró' })
        }
        await insumo.destroy()
        return res.status(200).json({ message: 'Insumo eliminado correctamente' })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const getReporteDiario = async (req, res) => {
    const fecha = req.params.fecha;
    try {
        const inicioDeOperacion = '2024-05-01';
        const fechaDeInicio = moment(inicioDeOperacion).format('YYYY-MM-DD');
        const inputFecha = moment(fecha).tz('America/Mexico_city').format('YYYY-MM-DD')
        const inicioDia = moment(inputFecha).startOf('day').set({ hour: 0 });
        const finDeDia = moment(inputFecha).endOf('day');
        const hoy = moment().startOf("day");

        if (moment(inputFecha).isAfter(hoy)) {
            return res.json({ message: "La fecha dada no tiene registros aún." })
        }
        if (moment(inputFecha).isBefore(fechaDeInicio)) {
            return res.json({ message: "La fecha proporciona es anterior al inicio de operaciones" });
        }
        const entradasDelDia = await EntradaModel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: inicioDia, // Mayor o igual al inicio del día
                    [Op.lte]: finDeDia // Menor o igual al final del día
                }
            }
        })
        const salidasDelDia = await SalidaModel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: inicioDia, // Mayor o igual al inicio del día
                    [Op.lte]: finDeDia // Menor o igual al final del día
                }
            }
        })
        return res.json({ message: "Insumos con moviento de fecha", inputFecha, entradas: entradasDelDia, salidas: salidasDelDia });
    } catch (error) {
        return res.json({ message: error.message });
    }
};

export const updateInsumosIn = async (req, res) => {
    try {

        const cantidadEntrante = req.body.cantidadEntrante;
        const unidadMedida = req.body.unidadMedida;

        if (typeof cantidadEntrante !== "number") {
            return res.status(400).json({ message: "Tipos de datos ingresados no son validos" })
        }
        const insumo = await InsumoModel.findOne({
            where: {
                insumoId: req.params.id
            }
        })
        if (!insumo) {
            return res.status(404).json({ message: "Insumo no encontrado, por favor, verifique" })
        }
        const nuevaCantidad = insumo.cantidadExistente + cantidadEntrante;
        if (nuevaCantidad > 1000) {
            return res.status(400).json({ message: "Cantidad ingresada esta fuera de los limites permitidos, valide la cantidad y vuelva a intentar" });
        }
        await InsumoModel.update({ cantidadExistente: nuevaCantidad }, {
            where: { insumoId: req.params.id },
        });
        const entradaData = {
            insumoId: insumo.insumoId,
            nombre: insumo.nombre,
            cantidadEntrante: cantidadEntrante,
            unidadMedida: unidadMedida
        }
        const nuevaEntrada = await createEntradaRecord(entradaData);
        return res.json({ message: "Insumo actualizado y entrada creada", entrada: nuevaEntrada });
    } catch (error) {
        return res.json({ message: error.message });
    }
};

export const updateInsumosOut = async (req, res) => {
    try {
        const cantidadSaliente = req.body.cantidadSaliente;
        const unidadMedida = req.body.unidadMedida;

        if (typeof cantidadSaliente !== "number") {
            return res.status(400).json({ message: "Los tipos de datos ingresados no son validos" })
        }
        const insumo = await InsumoModel.findOne({
            where: {
                insumoId: req.params.id,
            }
        })
        if (!insumo) {
            return res.status(400).json({ message: "Insumo no encontrado, por favor verifique" })
        }
        const nuevaCantidad = insumo.cantidadExistente - cantidadSaliente;
        if (nuevaCantidad < 0) {
            return res.status(400).json({ message: "Cantidad disponible insufuciente, valide la cantidad y vuelva a intentar" });
        }

        await InsumoModel.update({ cantidadExistente: nuevaCantidad }, {
            where: { insumoId: req.params.id },
        });
        const salidaData = {
            insumoId: insumo.insumoId,
            nombre: insumo.nombre,
            cantidadSaliente: cantidadSaliente,
            unidadMedida: unidadMedida
        }
        const nuevaSalida = await createSalidaRecord(salidaData);
        let alerta = '';
        if (insumo.cantidadMinRequerida > nuevaCantidad) {
            alerta = 'Este insumo esta por debajo de su cantidad minima';
        }
        return res.json({ message: "Insumo actualizado y salida creada", salida: nuevaSalida, alerta: alerta });
    } catch (error) {
        return res.json({ message: error.message });
    }
};