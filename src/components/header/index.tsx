import styles from './styles.module.css';
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link';

export function Header() {

  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href='/'>
            <h1 className={styles.logo}>
              Tarefas<span>+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link className={styles.link} href='/dashboard'>
              Meu Painel
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <div>
            <span className={styles.name}>Olá, {session.user?.name}</span>
            <button className={styles.signInButton} onClick={() => signOut()}>
              Sair
            </button>
          </div>
        ) : (
          <button className={styles.loginButton} onClick={() => signIn("google")}>
            Acessar
          </button>
        )}
      </section>
    </header>
  )
}