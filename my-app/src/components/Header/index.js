import React, { useEffect } from 'react';
import "./styles.css"; 
import { auth } from '../../firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import { signOut } from 'firebase/auth'; 
import userImg from "../../assets/user.svg"; 

function Header() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !loading) {
            navigate("/dashboard");
        }
    }, [user, loading, navigate]);

    function logoutFnc() {
        signOut(auth)
            .then(() => {
                toast.success('Desconectado com sucesso!');
                navigate('/');
            })
            .catch((error) => {
                toast.error(`Erro ao desconectar: ${error.message}`);
            });
    }

    return (
        <div className='navbar'>
            <p className='logo'>CashControl</p>
            {user && (
                <div className='user-container'>
                    <img
                        src={user.photoURL ? user.photoURL : userImg}
                        alt="User"
                        className='user-img'
                    />
                    <p className='link' onClick={logoutFnc}>
                        Logout
                    </p>
                </div>
            )}
        </div>
    );
}

export default Header;
