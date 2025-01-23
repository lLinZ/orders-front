import { useState, FC, useEffect } from 'react'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import blue from '@mui/material/colors/blue'
import green from '@mui/material/colors/green'
import lightBlue from '@mui/material/colors/lightBlue'

import WhatsApp from '@mui/icons-material/WhatsApp'
import Instagram from '@mui/icons-material/Instagram'
import Twitter from '@mui/icons-material/Twitter'
import Facebook from '@mui/icons-material/Facebook'

import { Form, Formik, FormikState, FormikValues } from 'formik'
import * as Yup from 'yup';


import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/user/UserStore'
import { ButtonCustom } from '../../components/custom'
import { CircularProgress } from '@mui/material'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const initialValues = {
    email: "",
    password: "",
}
const SigninSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email inválido")
        .min(10, 'Muy corta (min. 10)')
        .required('Campo obligatorio'),
    password: Yup.string()
        .required('Campo obligatorio'),
})

export const Login: FC = () => {
    const login = useUserStore((state) => state.login);
    const validateToken = useUserStore((state) => state.validateToken);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const router = useNavigate();
    
    useEffect(() => {
        validateSession();
    }, []);
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<{ email: string; password: string; }>> | undefined) => void) => {
        setIsSubmitting(true);
        const result = await login(values.email, values.password);
        if (result.status) {
            toast.success(result.message);
            router('/dashboard');
        } else {
            toast.error(result.message);
        }
        setIsSubmitting(false);
    }

    const validateSession = async () => {
        const response = await validateToken();
        setFirstRender(false);
        if (response.status) window.location.href = '/dashboard';
    }
    if(firstRender) return (<Box sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh"}}><CircularProgress /></Box>)
    return (
        <>
            <Box sx={styles.mainContainer}>
                <Box sx={styles.loginContainer}>
                    <Typography variant="h4" sx={{ fontWeight: "800" }}>Iniciar sesión</Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4 }}>Inicia para poder acceder a diferentes caracteristicas dentro de nuestro sitio web!</Typography>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                        validationSchema={SigninSchema}
                    >
                        {({ values, handleSubmit, handleChange }) => (
                            <Form onSubmit={handleSubmit}>

                                <TextField label="Email" name="email" value={values.email} onChange={handleChange} fullWidth sx={styles.input} />
                                <TextField label="Contraseña" name="password" value={values.password} onChange={handleChange} fullWidth sx={styles.input} />
                                <ButtonCustom type="submit" color="primary" variant="contained" sx={styles.button} disableElevation fullWidth disabled={isSubmitting} endIcon={isSubmitting && <CircularProgress size={15} />}>Iniciar</ButtonCustom>
                            </Form>
                        )}
                    </Formik>
                    <Box sx={styles.redesContainer}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ width: "100%", textAlign: "center", mt: 3 }}>Síguenos en nuestras redes</Typography>
                        <IconButton component="a" href="https://wa.me" target="_blank" sx={styles.whatsapp}>
                            <WhatsApp style={{ color: "white" }} />
                        </IconButton>
                        <IconButton component="a" href="https://instagram.com" target="_blank" sx={styles.instagram}>
                            <Instagram style={{ color: "white" }} />
                        </IconButton>
                        <IconButton component="a" href="https://twitter.com" target="_blank" sx={styles.twitter}>
                            <Twitter style={{ color: "white" }} />
                        </IconButton>
                        <IconButton component="a" href="https://facebook.com" target="_blank" sx={styles.facebook}>
                            <Facebook style={{ color: "white" }} />
                        </IconButton>
                    </Box>
                </Box>
                <ToastContainer
                    stacked
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
            </Box>
        </>
    )
}
const styles = {
    mainContainer: {
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    loginContainer: {
        width: { xs: "100%", sm: 400, md: 600 },
        margin: "auto",
        p: 2
    },
    input: {
        mb: 1,
        "& fieldset": {
            borderRadius: "30px",
        },
        "& input": {

        },
    },
    button: {
        borderRadius: "30px",
        p: 1.8,
        textTransform: "none",
        // "&:hover": {
        //     boxShadow: `0 0 20px ${useUserStore.getState().user.color}`
        // }
    },
    link: {
        textTransform: "none",
        borderRadius: "30px",
        fontWeight: "bold",

    },
    linkContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 1
    },
    redesContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "row wrap"
    },
    instagram: {
        background: `radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%),
        radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), 
        radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), 
        radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), 
        radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), 
        radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), 
        radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), 
        linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)`,
        mr: 2, "&:hover": { opacity: 0.8 }
    },
    whatsapp: {
        background: green[500],
        mr: 2,
        "&:hover": {
            background: green[700]
        }
    },
    twitter: {
        background: lightBlue[500],
        mr: 2,
        "&:hover": {
            background: lightBlue[700]
        }
    },
    facebook: {
        background: blue[800],
        "&:hover": {
            background: blue[700]
        }
    }
}