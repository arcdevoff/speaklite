'use client';
import HomeAdvantage from './components/Advantage';
import HomeBanner from './components/Banner';
import HomePluses from './components/Pluses';
import HomePromo from './components/Promo';

const Home = () => {
  return (
    <div>
      <HomeBanner />
      <HomePluses />

      <HomePromo />

      <HomeAdvantage />
    </div>
  );
};

export default Home;
