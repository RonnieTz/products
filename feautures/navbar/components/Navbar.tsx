import styles from '../styles/style.module.css';
import Language from './Language';
import User from './User';
const { navbar } = styles;

const Navbar = () => {
  return (
    <nav className={navbar}>
      <User />
      <Language />
    </nav>
  );
};
export default Navbar;
