import React from 'react';
import './HomeStyle.css';
import HomeLogo from '../images/HomeLogo.png';
import SelectPic from '../images/SelectPic.png';
import KuchikomiPic from '../images/KuchikomiPic2.png';

function Home() {
  return (
    <>
    <img src={HomeLogo} alt="" className="HomeLogo" />
    
      <div className='title'>
        <h3>口コミ検索かイントロドンを選ぶ</h3>
      </div>

      <div className='AllContent'>
         <div className='SearchCon'>
          <img src={KuchikomiPic} alt="" className="KuchikomiPic" />
          <button className='SearchBt' onClick={() => window.location.href = '/Search'}>
            口コミ検索へ
          </button>
        </div>
      
        <div className='IntroCon'>
          <img src={SelectPic} alt="" className="SelectPic" />
          <button className='IntroBt' onClick={() => window.location.href = '/Intro'}>
            イントロドン
          </button>
        </div>
      </div>

     
    </>
  )
}

export default Home;