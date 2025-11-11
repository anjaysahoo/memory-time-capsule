import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { Separator } from '@/components/ui/separator';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white py-6">
        <Separator className="mb-6" />
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 Memory Time Capsule. Send messages to the future.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
