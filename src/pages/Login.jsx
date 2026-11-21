import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function mensajeDeAcceso(error) {
  if (error.code === 'invalid_credentials') return 'El correo o la contraseña son incorrectos.';
  if (error.code === 'email_not_confirmed') return 'Confirma el correo del usuario de prueba en Supabase.';
  return 'No se pudo iniciar sesión. Inténtalo de nuevo.';
}

export default function Login() {
  const { session, loading, signIn, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function iniciarSesion(evento) {
    evento.preventDefault();
    if (enviando || !configured) return;

    const correo = email.trim();
    if (!correo || !password.trim()) {
      setError('Escribe tu correo y contraseña.');
      return;
    }
    if (!evento.currentTarget.elements.email.validity.valid) {
      setError('Escribe un correo electrónico válido.');
      return;
    }

    setError('');
    setEnviando(true);
    try {
      const { error: errorDeAcceso } = await signIn(correo, password);
      if (errorDeAcceso) setError(mensajeDeAcceso(errorDeAcceso));
    } catch {
      setError('No se pudo conectar con Supabase. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (loading) return <p className="container py-4" role="status">Comprobando sesión…</p>;
  if (session) return <Navigate to="/productos" replace />;

  return (
    <main className="bg-body-tertiary min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <section className="col-sm-10 col-md-7 col-lg-5 col-xl-4" aria-labelledby="titulo-login">
            <p className="fw-bold text-primary mb-2">ShopPanel</p>
            <form className="card shadow-sm p-4" onSubmit={iniciarSesion} noValidate>
              <h1 className="h3 mb-4" id="titulo-login">Iniciar sesión</h1>
              {!configured && (
                <p className="alert alert-warning" role="alert">
                  Configura las variables de Supabase en el archivo .env.local.
                </p>
              )}
              {error && <p className="alert alert-danger" role="alert">{error}</p>}
              <fieldset disabled={enviando || !configured}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Correo electrónico</label>
                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <input
                    className="form-control"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  {enviando ? 'Ingresando…' : 'Ingresar'}
                </button>
              </fieldset>
              {enviando && <span className="visually-hidden" role="status">Iniciando sesión…</span>}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
