import { Link } from 'react-router-dom';

function Navbar() {
    return(
        <div className="flex justify-between mx-auto px-10">
            <div className="normal-case text-xl">PsTemple</div>
            <div className="space-x-2">
                <Link to='/'>
                    <button className="">Explore</button>
                </Link>
                <Link to='/upload'>
                    <button className="">Upload Template</button>
                </Link>
                <Link to='/myuploads'>
                    <button className="">My Uploads</button>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;