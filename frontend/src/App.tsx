import { Router } from './layout/layout';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/Darkmodetoggle/themeprovider';
import { SidebarProvider } from './context/SidebarContext';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <RouterProvider router={Router}/>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
