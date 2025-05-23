// Removendo importação não utilizada do api
// import api from './api';

const CLIENT_ID = '0940992417b8a15c7b77a0b050938c0bab452c08';
const CLIENT_SECRET = '9aadd915a2081442944d849580f3567aaabd8cdef92bfc6cf245361de3bd';
const BASE_URL = import.meta.env.PROD ? 'https://g-sl-bt.vercel.app' : 'http://localhost:5173';
const REDIRECT_URI = `${BASE_URL}/callback`;

export const getAuthUrl = () => {
    // Limpa tokens antigos antes de iniciar nova autenticação
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_code_used');
    
    // Log para debug
    console.log('URL de redirecionamento configurada:', REDIRECT_URI);
    
    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&state=xyz123&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    
    // Log para debug
    console.log('URL de autorização completa:', authUrl);
    
    return authUrl;
};

export const getAccessToken = async (code: string) => {
    try {
        // Verifica se o código já foi usado
        const usedCode = localStorage.getItem('auth_code_used');
        if (usedCode === code) {
            throw new Error('Este código de autorização já foi usado.');
        }

        // Log para debug
        console.log('Iniciando troca de código por token');
        console.log('Código recebido:', code);
        console.log('URL de redirecionamento:', REDIRECT_URI);

        // Marca o código como usado
        localStorage.setItem('auth_code_used', code);

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);

        const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

        // Log para debug
        console.log('Parâmetros da requisição:', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        });

        const response = await fetch('/api/oauth/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Basic ${basicAuth}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do servidor:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText
            });
            throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Resposta do token:', data);

        const { access_token, refresh_token } = data;
        
        if (!access_token) {
            throw new Error('Token não recebido na resposta');
        }

        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token);
        }
        
        return access_token;
    } catch (error) {
        console.error('Erro detalhado ao obter token:', error);
        // Remove o código usado em caso de erro
        localStorage.removeItem('auth_code_used');
        throw error;
    }
}; 