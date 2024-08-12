import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from './styles.module.css';

import { getSession } from 'next-auth/react';
import { Textarea } from '../../components/textarea';
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'

import { db } from '@/services/firebaseConnction';
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';

interface HomeProps {
  user: {
    email: string;
  }
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTask() {
      const tarefasRef = collection(db, 'tarefas');
      const q = query(
        tarefasRef,
        orderBy('created', 'desc'),
        where('user', '==', user?.email),
      );

      onSnapshot(q, (snapshot) => {
        let taskList = [] as TaskProps[];

        snapshot.forEach((doc) => {
          taskList.push({
            id: doc.id,
            task: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public
          });
        });

        setTasks(taskList);
      });
    }

    loadTask();
  }, [user?.email]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  };

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === '') return;

    try {
      await addDoc(collection(db, 'tarefas'), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask
      })

      setInput('');
      setPublicTask(false);
    } catch (err) {
      console.log(err)
    }
  };

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert('URL copiada comm sucesso!');
  };


  async function handleDeleteTask(id: string) {
    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef);
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                placeholder='Digite sua tarefa'
              />
              <div className={styles.checkboxArea}>
                <input
                  checked={publicTask}
                  onChange={handleChangePublic}
                  className={styles.checkbox}
                  type="checkbox"
                />
                <label>Deixar tarefa publica</label>
              </div>
              <button className={styles.button} type='submit'>Registrar</button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>

          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>Público</label>
                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 size={20} color="#3183FF" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : <p>{item.task}</p>
                }

                <button className={styles.trashButton} onClick={() => handleDeleteTask(item.id)}>
                  <FaTrash size={20} color="#EA3140" />
                </button>
              </div>
            </article>
          ))}

        </section>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      }
    },
  };
};