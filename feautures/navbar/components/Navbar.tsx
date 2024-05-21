import styles from '../styles/style.module.css';
import User from './User';
const { navbar } = styles;

const Navbar = () => {
  return (
    <nav className={navbar}>
      <User />
    </nav>
  );
};
export default Navbar;
