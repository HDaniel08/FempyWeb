import DailyMoodCard from "./components/DailyMoodCard";
import UserActivityCard from "./components/UserActivityCard";
import './page.css'
export default function Queries() {
    return (
      <div className="queries">
     
        <h1>Lekérdezések</h1>
       <div className="card-container">
       <div className="query-card">
        <DailyMoodCard/>
        </div>
        <div className="query-card">
        <UserActivityCard/>
        </div>
        </div>
      </div>
    );
  }
  