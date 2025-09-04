import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../components/ui/menubar";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-gray-500 shadow-md">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-white">Gestion de Proyectos</h1>
      </div>

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Gestiones</MenubarTrigger>
          <MenubarContent className="bg-gray-500">
            <MenubarItem className="font-bold text-white">
              <Link to="/">Inicio</Link>
            </MenubarItem>
            <MenubarItem className="font-bold text-white">
              <Link to="/developers">Desarrolladores</Link>
            </MenubarItem>
            <MenubarItem className="font-bold text-white">
              <Link to="/projects">Proyectos</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
};

export default NavBar;
