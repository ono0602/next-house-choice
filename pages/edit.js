import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { supabase } from './supabaseClient'
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';


export default function Edit() {
  const [message, setMessage] = useState('Loading...');
  const [open, setOpen] = useState(false);

  const [item, setItem] = useState('');
  const [ranking, setRanking] = useState('')
  const [summary, setSummary] = useState('')

  const router = useRouter();
  const id = router.query.id



  const save = async () => {
    const now = format(utcToZonedTime(Date.now(), '+09:00'), 'yyyy/MM/dd HH:mm');
    try {
      const { data, error } = await supabase.from('hogeDB').update({ item: item, ranking: ranking, summary: summary, updatetime: now }).match({ id: id });
      await alert('保存しました。');
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  }


  const fetchData = async () => {
    if (id != undefined) {
      try {
        const { data, error } = await supabase.from('hogeDB').select('id,item,ranking,summary').match({ id: id });
        if (error) {
          throw error;
        }
        if (data) {
          data.map((dataObj) => {
            setItem(dataObj.item);
            setRanking(dataObj.ranking);
            setSummary(dataObj.summary);
          })
          setMessage('');
          setOpen(true);
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }



  useEffect(() => {
    fetchData();
  }, [id]);


  if (!open) return <div>{message}</div>


  return (
    <div className={styles.container}>
      <Head>
        <title>家探し準備</title>
        <meta name="description" content="どんな家に住みたいか理想を描く" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>
      </Head>


      <div className='d-flex my-2'>
        <h3 className='mt-4'>
          編集
        </h3>

        <button className='btn btn-secondary border border-dark ms-auto mt-4'>
          ログアウト
        </button>
      </div>

      <div className='d-flex mt-5'>
        <h5 className='me-auto mt-3'>
          {message}
          {item}
        </h5>

        <div>
          <button className='btn btn-default border border-dark p-3 mx-5'>
            <Link href='/'>
              <a>&lt;&lt; リスト</a>
            </Link>
          </button>
          <button className='btn btn-default border border-dark p-3'>
            <Link href='/memo'>
              <a>メモ &gt;&gt;</a>
            </Link>
          </button>
        </div>
      </div>
      <div className='form-group'>
        <label>優先順位</label>
        <input type='number' className='form-control' onChange={(e) => setRanking(e.target.value)} value={ranking}></input>
      </div>

      <div className='form-group'>
        <label>概要</label>
        <input type='text' className='form-control' onChange={(e) => setSummary(e.target.value)} value={summary}></input>
      </div>

      <button className='btn btn-info mx-auto d-block mt-5 px-4' onClick={save}>保存</button>
    </div >
  )
}
