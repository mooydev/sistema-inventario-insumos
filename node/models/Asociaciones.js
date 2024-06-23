import InsumoModel from "/InsumoModel.js";
import EntradaModel from "/EntradaModel.js";
import SalidaModel from "/SalidaModel.js";


InsumoModel.hasMany( EntradaModel, {
    foreignKey: insumoId, 
    as: 'entradas',
})

EntradaModel.belongsTo( InsumoModel, {
    foreignKey: insumoId,
    as: 'insumo',
})

InsumoModel.hasMany( SalidaModel, {
    foreignKey: insumoId, 
    as: 'salidas',
})

SalidaModel.belongsTo( InsumoModel, {
    foreignKey: insumoId,
    as: 'insumo',
})
