import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { supabase } from './supabaseClient'

export default function Home() {
  const [list, setList] = useState([]);

  const auth = async () => {
    const res = await supabase.auth.signUp({
      email: 'hoge@gmail.com',
      password: 'hogehoge'
    })
  }


  const signOut = async () => {
    supabase.auth.signOut();
    alert('ログアウトしました。');
  }


  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('hogeDB').select('*').order('ranking');
      if (error) {
        throw error;
      }
      if (data) {
        setList(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }


  useEffect(() => {
    auth()
    fetchData();
  }, []);


  return (
    <div className={styles.container}>
      <Head>
        <title>家探し準備</title>
        <meta name="description" content="どんな家に住みたいか理想を描く" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css"></link>
      </Head>

      <div className='d-flex my-2'>
        <h3 className='mt-4'>
          優先順位ランキング
        </h3>

        <button className='btn btn-secondary border border-dark ms-auto mt-4' onClick={() => signOut()}>
          ログアウト
        </button>
      </div>

      <div className='d-flex mt-5'>
        <h5 className='mt-3'>
          転居目的：
        </h5>
        <select className='form-select my-2' style={{ width: '25%' }}>
          <option selected>生活費下げ</option>
          <option>より良い物件</option>
          <option>家購入</option>
          <option>転勤</option>
          <option>結婚</option>
          <option>同棲</option>
          <option>出産</option>
          <option>一人暮らし</option>
          <option value='その他'>その他</option>
        </select>


        <div className='ms-auto'>
          <button className='btn btn-default border border-dark p-3'>
            <Link href='/memo'>
              <a>メモ &gt;&gt;</a>
            </Link>
          </button>
        </div>
      </div>

      <div className='mt-4'>
        <table className='table table-bordered'>
          <thead className='table-danger'>
            <tr>
              <th width='10%'>順位</th>
              <th width='20%'>項目</th>
              <th>概要</th>
              <th width='20%'>更新日時</th>
              <th width='8%'>編集</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} >
                <td className='align-middle text-center'>{item.ranking}</td>
                <td className='align-middle'>{item.item}</td>
                <td className='align-middle'>{item.summary}</td>
                <td className='align-middle'>{item.updatetime}</td>
                <td className='align-middle text-center'><a href={`/edit?id=${item.id}`}><i className="bi bi-pencil-square"></i></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
