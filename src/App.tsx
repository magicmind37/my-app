/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './App.css';
import Memefrog from './icons/memefrog'; // Ensure this path is correct
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin,memefrogCoin, mainCharacter } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';

const App: React.FC = () => {
  // Level names and associated minimum points for each level
  const levelData = [
    { name: "Bronze", minPoints: 0 },
    { name: "Silver", minPoints: 5000 },
    { name: "Gold", minPoints: 25000 },
    { name: "Platinum", minPoints: 100000 },
    { name: "Diamond", minPoints: 1000000 },
    { name: "Epic", minPoints: 2000000 },
    { name: "Legendary", minPoints: 10000000 },
    { name: "Master", minPoints: 50000000 },
    { name: "GrandMaster", minPoints: 100000000 },
    { name: "Lord", minPoints: 1000000000 },
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(22749365);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 11;
  const profitPerHour = 126420;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  // Calculate time left for daily rewards
  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);
    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Update countdowns every minute
  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const clickPosition = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
    card.style.transform = `perspective(1000px) rotateX(${-clickPosition.y / 10}deg) rotateY(${clickPosition.x / 10}deg)`;
    setTimeout(() => { card.style.transform = ''; }, 100);
    setPoints((prev) => prev + pointsToAdd);
    setClicks((prevClicks) => [...prevClicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelData.length - 1) return 100;
    const currentLevelMin = levelData[levelIndex].minPoints;
    const nextLevelMin = levelData[levelIndex + 1].minPoints;
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelData[levelIndex].minPoints;
    const nextLevelMin = levelData[levelIndex + 1].minPoints;
    if (points >= nextLevelMin && levelIndex < levelData.length - 1) setLevelIndex(levelIndex + 1);
    else if (points < currentLevelMin && levelIndex > 0) setLevelIndex(levelIndex - 1);
  }, [points, levelIndex, levelData]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1e9) return `+${(profit / 1e9).toFixed(2)}B`;
    if (profit >= 1e6) return `+${(profit / 1e6).toFixed(2)}M`;
    if (profit >= 1e3) return `+${(profit / 1e3).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full h-screen bg-black text-white font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Memefrog size={24} className="text-[#d4d4d4]" /> {/* Use Memefrog as a component */}
            </div>
            <p className="text-sm">megamind (CEO)</p>
          </div>

          <div className="flex items-center justify-between mt-1 space-x-4">
            <div className="w-1/3">
              <div className="flex justify-between">
                <p className="text-sm">{levelData[levelIndex].name}</p>
                <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelData.length}</span></p>
              </div>
              <div className="mt-1 bg-[#43433b]/[0.6] rounded-full border-2 border-[#43433b]">
                <div className="h-2 bg-[#43433b]/[0.6] rounded-full">
                  <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center w-2/3 border-2 border-[#43433b] bg-[#43433b]/[0.6] rounded-full px-4 py-[2px] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2" />
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2" />
              <Settings className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              {[
                { title: 'Daily Reward', image: dailyReward, timeLeft: dailyRewardTimeLeft },
                { title: 'Daily Cipher', image: dailyCipher, timeLeft: dailyCipherTimeLeft },
                { title: 'Daily Combo', image: dailyCombo, timeLeft: dailyComboTimeLeft }
              ].map(({ title, image, timeLeft }) => (
                <div key={title} className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot" />
                  <img src={image} alt={title} className="mx-auto w-12 h-12" />
                  <p className="text-[10px] text-center text-white mt-1">{title}</p>
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{timeLeft}</p>
                </div>
              ))}
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div className="w-80 h-80 p-4 rounded-full circle-outer" onClick={handleCardClick}>
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fixed Div */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
          {[
            { image: binanceLogo, label: 'Exchange' },
            { icon: <Mine className="w-8 h-8" />, label: 'Mine' },
            { icon: <Friends className="w-8 h-8" />, label: 'Friends' },
            { icon: <Coins className="w-8 h-8" />, label: 'Earn' },
            { image: memefrogCoin, label: 'Airdrop' }
          ].map(({ image, icon, label }) => (
            <div key={label} className="text-center text-[#85827d] w-1/5 m-1 p-2 rounded-2xl">
              {image ? <img src={image} alt={label} className="w-8 h-8 mx-auto" /> : icon}
              <p className="mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Click animations */}
        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
            style={{
              top: `${click.y - 42}px`,
              left: `${click.x - 28}px`,
              animation: 'float 1s ease-out'
            }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            {pointsToAdd}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;