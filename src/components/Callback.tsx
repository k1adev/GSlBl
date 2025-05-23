import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../services/auth';
import { CircularProgress, Container, Typography, Alert } from '@mui/material';

export const Callback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const processAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const errorParam = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');

            if (errorParam || errorDescription) {
                console.error('Erro retornado pelo Bling:', { error: errorParam, description: errorDescription });
                setError(errorDescription || 'Erro na autenticação');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            if (!code) {
                console.error('Nenhum código recebido');
                setError('Nenhum código de autorização recebido');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            if (isProcessing) {
                return;
            }

            setIsProcessing(true);

            try {
                // Verifica se já temos um token válido
                const existingToken = localStorage.getItem('access_token');
                if (existingToken) {
                    console.log('Token existente encontrado, redirecionando...');
                    navigate('/notas');
                    return;
                }

                console.log('Código recebido:', code);
                console.log('Iniciando troca do código por token...');
                await getAccessToken(code);
                console.log('Token obtido com sucesso!');
                
                // Limpa a URL antes de redirecionar
                window.history.replaceState({}, document.title, '/callback');
                
                navigate('/notas');
            } catch (error) {
                console.error('Erro detalhado na autenticação:', error);
                const errorMessage = error instanceof Error ? error.message : 'Erro ao processar autenticação';
                
                if (errorMessage.includes('já foi usado')) {
                    const hasToken = localStorage.getItem('access_token');
                    if (hasToken) {
                        console.log('Código já usado mas token existe, redirecionando...');
                        navigate('/notas');
                        return;
                    }
                    // Se não tem token, redireciona para fazer login novamente
                    console.log('Código já usado e sem token, redirecionando para login...');
                    setError('Sessão expirada. Por favor, faça login novamente.');
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }
                
                setError(errorMessage);
                setTimeout(() => navigate('/'), 5000);
            } finally {
                setIsProcessing(false);
            }
        };

        processAuth();
    }, [navigate, isProcessing]);

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {error ? (
                <Alert severity="error" sx={{ mb: 2, maxWidth: '600px' }}>
                    {error}
                </Alert>
            ) : (
                <>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Processando autenticação...
                    </Typography>
                </>
            )}
        </Container>
    );
}; 