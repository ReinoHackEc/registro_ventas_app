import { useState } from 'react'; import { supabase } from '../lib/supabaseClient';
export default function Ventas() {
  const [sku, setSku] = useState(''); const [serie, setSerie] = useState('');
  const [accesorios, setAccesorios] = useState([]); const [documento, setDocumento] = useState('NV');
  const [formaPago, setFormaPago] = useState('Efectivo');
  const [clienteNombre, setClienteNombre] = useState(''); const [clienteId, setClienteId] = useState('');
  const [valor, setValor] = useState(''); const [mensaje, setMensaje] = useState('');

  const guardarVenta = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data: userData } = await supabase.from('usuarios').select('*').eq('correo', user.email).single();

    const venta = {
      cliente_nombre: clienteNombre,
      cliente_id: clienteId,
      documento,
      forma_pago: formaPago,
      total: Number(valor),
      vendedor_id: userData.id
    };

    const { data: ventaCreada, error: errorVenta } = await supabase.from('ventas').insert([venta]).select().single();
    if (errorVenta) return setMensaje('Error guardando venta');

    const prod = { venta_id: ventaCreada.id, sku, serie, valor: Number(valor) };
    const { error: errorProducto } = await supabase.from('productos_vendidos').insert([prod]);
    if (errorProducto) return setMensaje('Error guardando producto');

    for (let acc of accesorios) {
      await supabase.from('accesorios_vendidos').insert([{ venta_id: ventaCreada.id, sku: acc.sku, valor: Number(acc.valor) }]);
    }

    setMensaje('✅ Venta registrada con éxito');
  };

  const agregarAccesorio = () => {
    setAccesorios([...accesorios, { sku: '', valor: '' }]);
  };

  return (
    <div>
      <h2>Registro Venta</h2>
      <input placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} />
      <input placeholder="Serie" value={serie} onChange={e => setSerie(e.target.value)} />
      <input placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
      <hr />
      <button onClick={agregarAccesorio}>+ Accesorio</button>
      {accesorios.map((acc, i) => (
        <div key={i}>
          <input placeholder="SKU Accesorio" onChange={e => {
            const copy = [...accesorios]; copy[i].sku = e.target.value; setAccesorios(copy);
          }} />
          <input placeholder="Valor" onChange={e => {
            const copy = [...accesorios]; copy[i].valor = e.target.value; setAccesorios(copy);
          }} />
        </div>
      ))}
      <hr />
      <select value={documento} onChange={e => setDocumento(e.target.value)}>
        <option>NV</option><option>FCT</option>
      </select>
      <select value={formaPago} onChange={e => setFormaPago(e.target.value)}>
        <option>Efectivo</option><option>Chase Bank</option><option>Trade in</option><option>Medianet</option>
        <option>Transferencia Guayaquil</option><option>Transferencia Bolivariano</option><option>Pago Medios</option>
      </select>
      <input placeholder="Nombre Cliente" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} />
      <input placeholder="Identificación" value={clienteId} onChange={e => setClienteId(e.target.value)} />
      <br />
      <button onClick={guardarVenta}>Registrar Venta</button>
      <p>{mensaje}</p>
    </div>
  );
}
