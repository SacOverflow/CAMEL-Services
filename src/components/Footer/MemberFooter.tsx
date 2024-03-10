import React from 'react';
import './Memberfooter.css';

const MemberFooter = () => {
	return (
		// sticky footer
		<div className="stickyfooter">
			<div className="flex-grow"></div>
			<footer className="footercontainer">
				<div className="foottitle">
					<h1>Members</h1>
				</div>
				<div className="simpleflex">
					{/* names of team members with links to github */}
					<a href="https://github.com/jvniorrr">Fernando Mendoza</a>
					<a href="https://github.com/hashemJaber">Hashem Jaber</a>
					<a href="https://github.com/RealHoltz">Jacob Correa</a>
					<a href="https://github.com/JDoan03">Joseph Doan</a>
					<a href="https://github.com/Miguel1357">Miguel Lopez</a>
					<a href="https://github.com/KiranKaur3">Kiranjot Kaur</a>
					<a href="https://github.com/imrenmore">Imren More</a>
					<a href="https://github.com/DGConn">Dakotta Conn</a>
				</div>
			</footer>
		</div>
	);
};

export default MemberFooter;
