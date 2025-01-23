import { useEffect, useState } from "react"
import useEcho from "../common/useEcho"
import { useUserStore } from "../store/user/UserStore";
import { request } from "../common/request";
import { Box, Chip, Toolbar, Tooltip } from "@mui/material";
import { TypographyCustom } from "../components/custom";
import { Bounce, toast, ToastContainer } from "react-toastify";

interface IOrder {
    id: number;
    description: string;
    order_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}
export const Dashboard = () => {
    const echo = useEcho()
    const validateToken = useUserStore((state) => state.validateToken);
    const [orders, setOrders] = useState<IOrder[]>([])
    const user = useUserStore((state) => state.user);
    const validateSession = async () => {
        const response = await validateToken();
        if (response.status === false) window.location.href = '/';
    }
    const getOrders = async () => {
        const { status, response, err }: { status: number, response: any, err: any } = await request('/orders', 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setOrders(data);
                break;
            default:
                console.log({ err });
                break;
        }
    }
    useEffect(() => {
        if (orders.length === 0) {
            getOrders();
        }
        if (!user.logged) {
            validateSession();
        }
        if (user.logged) {
            if (echo) {
                echo.channel('public')
                    .listen('CreateOrder', (event: any) => {
                        handleCreate(event);
                    })
                    .listen('DeleteOrder', (event: any) => {
                        handleDelete(event);
                    })
            }
        }
        return () => {
            if (echo) {
                echo.leave('public')
            }
        }
    }, [user.logged])

    const handleCreate = (event: any) => {
        setOrders([...orders, event.order]);
        toast.success('Orden creada');
    }
    const handleDelete = (event: any) => {
        getOrders();
        toast.info('Se ha cerrado una orden');
    }
    if (orders.length === 0)
        return (
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TypographyCustom variant="h2" color="primary">¡No hay ordenes!</TypographyCustom>
            </Box>
        )

    return (
        <>
            <Toolbar />
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 2, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {orders.map((order) => (
                        <Box key={order.id} sx={{ display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center', borderRadius: 5, border: `1px solid ${user.color}`, p: 2, gap: 2, minHeight: 200, minWidth: 200 }}>
                            <Box sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                <TypographyCustom variant="h4">#{order.order_id}</TypographyCustom>
                                <Chip label={order.status} sx={{
                                    backgroundColor: order.status === 'Activo' ? 'purple' : order.status === 'Esperando' ? 'orange' : order.status === 'Terminado' ? 'green' : 'red',
                                }} />
                            </Box>
                            <Tooltip title={`Descripcion completa: "${order.description}"`}>
                                <span>
                                    <TypographyCustom variant="subtitle2" color="text.secondary">{order.description.substring(0, 20)} ...</TypographyCustom>
                                </span>
                            </Tooltip>
                        </Box>
                    ))}
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
