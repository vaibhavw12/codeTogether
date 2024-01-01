import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Edit from './pages/Edit';

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-center"
                    reverseOrder={true}
                    
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor/:roomId"
                        element={<Edit />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
