import SalidaModel from "../models/SalidaModel.js";

export const createSalidaRecord = async (salidaData) => {
    try {
        const salida  = await SalidaModel.create(salidaData);
        return salida;
    } catch (error) {
        throw new Error (error.message);
    }
};

export const createSalida = async (req, res) => {
    try {
        await createSalidaRecord(req.body);
        res.json({message: "Salida de insumo hecha" });
    } catch (error) {
        res.json({ message: error.message });
    }  
};