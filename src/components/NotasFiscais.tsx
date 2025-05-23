import { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import type { NotaFiscal } from '../services/nfe';
import { buscarNotasFiscais, buscarXmlNotaFiscal } from '../services/nfe';

export const NotasFiscais = () => {
    const [notas, setNotas] = useState<NotaFiscal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarNotas();
    }, []);

    const carregarNotas = async () => {
        try {
            const data = await buscarNotasFiscais();
            setNotas(data);
        } catch (error) {
            console.error('Erro ao carregar notas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadXml = async (id: string) => {
        try {
            const xml = await buscarXmlNotaFiscal(id);
            const blob = new Blob([xml], { type: 'text/xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nota-fiscal-${id}.xml`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Erro ao baixar XML:', error);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Notas Fiscais
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número</TableCell>
                            <TableCell>Série</TableCell>
                            <TableCell>Data de Emissão</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notas.map((nota) => (
                            <TableRow key={nota.id}>
                                <TableCell>{nota.numero}</TableCell>
                                <TableCell>{nota.serie}</TableCell>
                                <TableCell>
                                    {new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleDownloadXml(nota.id)}
                                    >
                                        Baixar XML
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}; 