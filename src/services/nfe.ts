import api from './api';

export interface NotaFiscal {
    id: string;
    numero: string;
    serie: string;
    dataEmissao: string;
    xml: string;
}

export const buscarNotasFiscais = async () => {
    try {
        const response = await api.get('/notas/fiscais/vendas');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar notas fiscais:', error);
        throw error;
    }
};

export const buscarXmlNotaFiscal = async (id: string) => {
    try {
        const response = await api.get(`/notas/fiscais/vendas/${id}/xml`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar XML da nota fiscal:', error);
        throw error;
    }
}; 