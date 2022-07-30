import { Link } from 'react-router-dom';

function Footer() {
    return(
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
            <div className="grid grid-flow-col gap-4">
                <Link to='/' className="link link-hover">Home</Link> 
                <Link to='/about' className="link link-hover">About us</Link> 
            </div> 
            <div>
                <p>Copyright © 2022 - All right reserved by PsTemple Ltd</p>
            </div>
        </footer>
    );
}

export default Footer;