import { GetStaticProps } from 'next';
import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from 'next/image';
import heroImg from '../../public/assets/hero.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConnction';

interface HomeProps {
  posts: number;
  comments: number;
}
export default function Home({posts, comments}: HomeProps) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.logo}
            src={heroImg}
            alt="Logo Tarefas+"
            priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema para você organizar <br />
          seus estudos e taredas
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>{posts} Farefas</span>
          </section>
          <section className={styles.box}>
            <span>{comments} Comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  const commentRef = collection(db, 'comments');
  const postRef = collection(db, 'tarefas');

  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);
  
  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60,
  }
}