import React, { useState } from 'react';
import './HomeStyle.css';
import HomeLogo from '../images/HomeLogo.png';
import SelectPic from '../images/SelectPic.png';
import KuchikomiPic from '../images/KuchikomiPic.png';
import BackgroundImage1 from '../images/osinoko.webp'; // 初期の背景画像のパス
import BackgroundImage2 from '../images/hikanoko.jpg'; // 新しい背景画像のパス

function Home() {
  const [logoClickCount, setLogoClickCount] = useState(0);
  const maxClickCount = 5;

  const handleLogoClick = () => {
    setLogoClickCount(prevCount => prevCount + 1);
  };

  const getBackgroundImage = () => {
    // クリック数に応じて適切な背景画像のパスを返す
    if (logoClickCount < maxClickCount) {
      return BackgroundImage1;
    } else {
      return BackgroundImage2; // 3回以上クリックされたら新しい背景画像に変更
    }
  };

  const bodyStyle = {
    backgroundImage: `url(${getBackgroundImage()})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backgroundBlendMode: 'lighten',
    height: '100vh', // 画面全体の高さに合わせる
  };

  return (
    <div style={bodyStyle}>
      <img src={HomeLogo} alt="" className="HomeLogo" onClick={handleLogoClick} />

      <div className='title'>
        <h3>口コミ検索かイントロドンを選ぶ</h3>
      </div>

      <div className='AllContent'>
        <div className='SearchCon'>
          <img src={KuchikomiPic} alt="" className="KuchikomiPic" />
          <button className='NextSearchBt' onClick={() => window.location.href = '/Search'}>
            口コミ検索へ
          </button>
        </div>

        <div className='IntroCon'>
          <img src={SelectPic} alt="" className="SelectPic" />
          <button className='IntroBt' onClick={() => window.location.href = '/ranking'}>
            イントロドン
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
