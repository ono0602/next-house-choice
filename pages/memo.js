import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { supabase } from './supabaseClient'
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';


export default function Memo() {
  const [memo, setMemo] = useState('');
  const [updatetime, setUpdatetime] = useState('');

  const [message, setMessage] = useState('Loading...');
  const [open, setOpen] = useState(false);




  const save = async () => {
    const now = format(utcToZonedTime(Date.now(), '+09:00'), 'yyyy/MM/dd HH:mm');
    if (memo) {
      memo += `(${now}保存済)`;
    }
    setUpdatetime(now);
    try {
      const { data, error } = await supabase.from('hogehogeDB').update({ memo: memo, updatetime: now }).match({ id: 1 });
    } catch (error) {
      alert(error.message);
    }
  }


  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('hogehogeDB').select('*');
      if (error) {
        throw error;
      }
      if (data) {
        data.map((dataObj) => {
          setMemo(dataObj.memo);
          setUpdatetime(dataObj.updatetime);
        })
        setMessage('');
        setOpen(true);
      }
    } catch (error) {
      alert(error.message);
    }
  }



  useEffect(() => {
    fetchData();
  }, [updatetime]);


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
          メモ
        </h3>

        <button className='btn btn-secondary border border-dark ms-auto mt-4'>
          ログアウト
        </button>
      </div>

      <div className='d-flex mt-5'>
        <h5 className='me-auto mt-3'>
          最新更新日時：{updatetime}
        </h5>

        <div>
          <button className='btn btn-default border border-dark p-3'>
            <Link href='/'>
              <a>&lt;&lt; リスト</a>
            </Link>
          </button>

        </div>
      </div>



      <div className='mt-5'>
        <textarea className={styles.memo} onChange={(e) => setMemo(e.target.value)} value={memo} id='text'></textarea>
      </div>

      <button className='btn btn-info mx-auto d-block mt-5 px-4' onClick={save}>保存</button>
    </div >
  )
}
