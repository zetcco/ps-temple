import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const currentPath = useLocation().pathname;
    return(
        <div className="navbar bg-base-300">
            <div className='container mx-auto'>
                <div className="flex-1">
                    <Link to='/' className="btn btn-ghost normal-case text-xl">
                        PsTemple
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal p-0 gap-2">
                        <li><Link to='/' className={currentPath === '/' ? 'active' : ' '}>Explore</Link></li>
                        <li><Link to='/upload' className={currentPath === '/upload' ? 'active' : ' '}>Upload</Link></li>
                        <li><Link to='/myuploads' className={currentPath === '/myuploads' ? 'active' : ' '}>My Uploads</Link></li>
                    </ul>
                </div>
            </div>
        </div> 
    );
}

export default Navbar;