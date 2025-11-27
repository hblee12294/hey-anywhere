import { enableLongPressStorage } from "@/utils/storage";
import { useStorage } from "@/utils/useStorage";
import "./App.css";

function App() {
  const [enableLongPress, setEnableLongPress] = useStorage<boolean>(
    enableLongPressStorage
  );

  return (
    <div className="container">
      <header>
        <h1>Hey Fill</h1>
      </header>

      <div className="section">
        <div className="row">
          <label htmlFor="long-press">Enable Long Press</label>
          <input
            id="long-press"
            type="checkbox"
            checked={!!enableLongPress}
            onChange={(e) => setEnableLongPress(e.target.checked)}
            className="toggle"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
