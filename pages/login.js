import { useState } from 'react'; import { supabase } from '../lib/supabaseClient'; import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(null); const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/');
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Entrar</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
