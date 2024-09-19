// Importa as funções necessárias dos SDKs do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Configuração do Firebase para conectar o seu aplicativo ao Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD5Ui1SgtAso634MR5d8I9GzK3SqX6feGQ",  // Chave da API para autenticação e acesso aos serviços do Firebase
  authDomain: "controlcash-2c5f9.firebaseapp.com",  // Domínio para autenticação
  projectId: "controlcash-2c5f9",  // ID do projeto Firebase
  storageBucket: "controlcash-2c5f9.appspot.com",  // Bucket de armazenamento para arquivos
  messagingSenderId: "298430887445",  // ID do remetente de mensagens para envio de notificações
  appId: "1:298430887445:web:af94f82c9702547ba0001c",  // ID do aplicativo Firebase
  measurementId: "G-9SJRVENPHF"  // ID de medição para Analytics
};

// Inicializa o aplicativo Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);

// Obtém a instância do serviço de Analytics (se necessário para rastreamento e análise de dados)
const analytics = getAnalytics(app);

// Obtém a instância do Firestore para manipulação de banco de dados
const db = getFirestore(app);

// Obtém a instância do serviço de autenticação do Firebase
const auth = getAuth(app);

// Cria uma instância do provedor de autenticação do Google para permitir login com contas do Google
const provider = new GoogleAuthProvider();

// Exporta as instâncias e funções para uso em outras partes do aplicativo
export { db, auth, provider, doc, setDoc };
