import React, { useContext, useState, useEffect } from "react";
//imports the context to be able to access user details
import UserContext from "../../context/UserContext";
//imports the logout component to be used in the navbar
import Logout from "../Auth/Logout";
//imports the icons to be used with the mobile menu
import { FaBars, FaTimes } from "react-icons/fa";
//imports the link from the site navigation library
import { Link } from "react-router-dom";
//uses the css file for the navbar
import "./Navbar.css";

function Navbar() {
	//gets the user details from the context
	const { user, setUser } = useContext(UserContext);
	//sets the mobile menu to be closed by default
	const [open, setOpen] = useState(false);
	//presets the size of the window variables
	const [size, setSize] = useState({
		width: undefined,
		height: undefined,
	});

	//sets the size state to the actual size of the window whenever it is changed
	useEffect(() => {
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	//function called whenever the window size changes
	useEffect(() => {
		//if the menu is open and the window is made larger
		if (size.width > 768 && open) {
			//it closes the menu
			setOpen(false);
		}
	}, [size.width, open]);

	//function to open or close the menu
	const menuToggler = () => {
		setOpen((p) => !p);
	};

	//function to ensure the menu is closed regardless of how it previously was
	const menuCloser = () => {
		setOpen(false);
	};

	return (
		<>
			<nav className="navContainer">
				<Link className="homeLink" to="/" onClick={menuCloser}>
					CinemaPrices
				</Link>
				<div className="menuIcon" onClick={menuToggler}>
					{open ? <FaTimes /> : <FaBars />}
				</div>
				<ul className={open ? "navMenu active" : "navMenu"}>
					<li className="menuItem">
						<Link className="navLink" to="/search" onClick={menuCloser}>
							Movie Search
						</Link>
					</li>
					<li className="menuItem">
						<Link
							className="navLink"
							to="/recommendations"
							onClick={menuCloser}
						>
							Movie Recommendations
						</Link>
					</li>
					{user.user_id ? (
						<li className="menuItem">
							<Link className="navLink" to="/profile" onClick={menuCloser}>
								Profile
							</Link>
						</li>
					) : (
						<li className="menuItem">
							<Link className="navLink" to="/register" onClick={menuCloser}>
								Register
							</Link>
						</li>
					)}
					<li className="menuItem">
						{user.user_id ? (
							<nav
								className="navButton"
								onClick={() => {
									Logout();
									setUser({});
								}}
							>
								<Link className="navButtonLink" to="/" onClick={menuCloser}>
									Log out
								</Link>
							</nav>
						) : (
							<nav className="navButton">
								<Link
									className="navButtonLink"
									to="/login"
									onClick={menuCloser}
								>
									Sign in
								</Link>
							</nav>
						)}
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
