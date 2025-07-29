import { useRouter } from 'next/router'; import { useEffect } from 'react'; import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else {
        const { data } = await supabase.from('usuarios').select('rol').eq('correo', user.email).single();
        if (data?.rol === 'vendedor') router.push('/ventas');
        else if (data?.rol === 'admin') router.push('/admin');
        else if (data?.rol === 'contadora') router.push('/contadora');
        else if (data?.rol === 'bodeguero') router.push('/bodega');
      }
    };
    checkUser();
  }, []);
  return <div>Redirigiendo...</div>;
}
