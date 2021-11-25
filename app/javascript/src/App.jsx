import React, {useState} from 'react'
import { initializeLogger } from "common/logger";
import authAPI from "apis/auth";

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeLogger();
        setAuthHeaders(setLoading);
      }, []);

    if (loading) {
        return <h1>Loading...</h1>;
      }
    return (
        <div>
            Hello world
        </div>
    )
}

export default App;