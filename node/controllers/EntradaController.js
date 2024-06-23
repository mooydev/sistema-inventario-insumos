import EntradaModel from '../models/EntradaModel.js'

export const createEntradaRecord = async (entradaData) => {
    try {
        const entrada  = await EntradaModel.create(entradaData);
        return entrada;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createEntrada = async (req, res) => {
    try {
        await createEntradaRecord(req.body);
        res.json({message: "Entrada de insumo hecha" });
    } catch (error) {
        res.json({ message: error.message });
    } 
}; 