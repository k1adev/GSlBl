import { Button, Container, Typography, Box } from '@mui/material';
import { getAuthUrl } from '../services/auth';

export const Login = () => {
    const handleLogin = () => {
        window.location.href = getAuthUrl();
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sistema de Notas Fiscais
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Conecte-se com sua conta do Bling
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    sx={{ mt: 3 }}
                >
                    Entrar com Bling
                </Button>
            </Box>
        </Container>
    );
}; 