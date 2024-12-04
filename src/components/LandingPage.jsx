import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="content">
        <h1 className="game-title">GDG Space Fighters</h1>
        <div className="spaceship-icon">▲</div>
        <button 
          className="play-button"
          onClick={() => navigate('/game')}
        >
          Start Mission
        </button>
      </div>
    </div>
  );
};

export default LandingPage;