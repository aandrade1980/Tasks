import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Index from './routes/Index';
import Task from './routes/Task';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Navbar />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<Task />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
