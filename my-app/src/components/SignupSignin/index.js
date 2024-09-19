import React, { useState } from 'react';
import "./styles.css"; // Importa o arquivo de estilos para o componente
import Input from '../Input'; // Componente para campos de entrada
import Button from '../Button'; // Componente para botões
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Funções do Firebase para autenticação
import { auth, db, provider } from '../../firebase'; // Instâncias do Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Funções do Firestore para manipulação de documentos
import { toast } from 'react-toastify'; // Biblioteca para exibir mensagens de toast
import { useNavigate } from 'react-router-dom'; // Hook para navegação entre páginas

function SignupSigninComponent() {
  const [name, setName] = useState(""); // Nome do usuário
  const [email, setEmail] = useState(""); // Email do usuário
  const [password, setPassword] = useState(""); // Senha do usuário
  const [confirmPassword, setConfirmePassword] = useState(""); // Confirmação de senha
  const [loginForm, setLoginForm] = useState(false); // Controle para alternar entre login e cadastro
  const [loading, setLoading] = useState(false); // Controle de carregamento
  const navigate = useNavigate(); // Hook para navegação programática

  function signupWithEmail() {
    setLoading(true);
    if (name !== '' && email !== '' && password !== '' && confirmPassword !== '') {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success('Usuário Criado');
            setLoading(false);
            setName('');
            setPassword("");
            setEmail('');
            setConfirmePassword('');
            createDoc(user);
            navigate('/dashboard');
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("As senhas não são iguais!");
        setLoading(false);
      }
    } else {
      toast.error('Todos os campos são obrigatórios!');
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);
    if (email !== '' && password !== '') {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("Usuário Logado!");
          setLoading(false);
          navigate('/dashboard');
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error('Todos os campos são obrigatórios');
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : '',
          createdAt: new Date(),
        });
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createDoc(user);
        setLoading(false);
        navigate('/dashboard');
        toast.success("Usuário Logado");
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  }

  return (
    
    <div className='signup-wrapper'>
      {loginForm ? (
        <>
          <h2 className='title'>
            Login em <span style={{ color: "var(--theme)" }}>Cash Control</span>
          </h2>
          <form>
            <Input 
              type="email"
              label={"Email"} 
              state={email} 
              setState={setEmail} 
              placeholder={"John@gmail.com"}
            />
            <Input
              type="password" 
              label={"Password"} 
              state={password} 
              setState={setPassword} 
              placeholder={"Exemplo123"}
            /> 
            <Button 
              disable={loading}
              text={loading ? "Loading..." : 'Entre usando Email e Senha'} 
              onClick={loginUsingEmail}
            />
            <p className='p-login'>ou</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading..." : 'Entre usando Google'} 
              blue={true}
            />
            <p className='p-login'
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Ou Não tem uma Conta? Clique aqui
            </p>
          </form>
        </>
      ) : (
        <>
          <h2 className='title'>
            Inscreva-se em <span style={{ color: "var(--theme)" }}>Cash Control</span>
          </h2>
          <form>
            <Input 
              label={"Nome Completo"} 
              state={name} 
              setState={setName} 
              placeholder={"John doe"}
            />
            <Input 
              type="email"
              label={"Email"} 
              state={email} 
              setState={setEmail} 
              placeholder={"John@gmail.com"}
            />
            <Input
              type="password" 
              label={"Password"} 
              state={password} 
              setState={setPassword} 
              placeholder={"Exemplo123"}
            /> 
            <Input 
              type="password"
              label={"Confirme Password"} 
              state={confirmPassword} 
              setState={setConfirmePassword} 
              placeholder={"Exemplo123"}
            />
            <Button 
              disable={loading}
              text={loading ? "Loading..." : 'Inscreva-se usando Email e Senha'} 
              onClick={signupWithEmail}
            />
            <p className='p-login'>ou</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading..." : 'Inscreva-se usando Google'} 
              blue={true}
            />
            <p className='p-login'
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Ou tem uma Conta? Clique aqui
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default SignupSigninComponent;
