import Card from '@/components/HomePage/Card';
import Buttons from '@/components/SharedComponents/Buttons';
import { Lexend_Giga } from 'next/font/google';
const inter = Lexend_Giga({ subsets: ['latin'] });
import Testimonial from '@/components/HomePage/Testimonial';

const cardOneContent = (
	<p className="description-text">
		<b>Cloud Asset Management Enhanced Launcher (CAMEL)</b>
		is aimed towards assisting Project Managers in running and managing
		their businesses efficiently. Through the use of this application,
		Business Owners will be able to make wiser and informed decisions
	</p>
);

const cardTwoContent = (
	<ul className="list-disc description-list">
		<li>All-In-One Dashboard</li>
		<li>Document Management</li>
		<li>Time Tracking and Management</li>
		<li>Reporting and Visualization Tools</li>
		<li>Task Prioritization and Scheduling</li>
		<li>Business Overview Analytics</li>
		<li>Project’s Overviews</li>
	</ul>
);

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between">
			<section id="home-section">
				<div id="image-content">
					<div className={inter.className}>
						<h3 className="page-title">
							Cloud Asset Management Enhanced Launcher
						</h3>
					</div>
					<div className="card-container">
						<Card
							title="Our Product"
							content={cardOneContent}
						/>
						<Card
							title="Features"
							content={cardTwoContent}
						/>
						<Card
							title="Testimonials"
							content={<Testimonial />}
						/>
					</div>
				</div>
				{/* join us btn */}
				<div className="join-us flex justify-center mt-6">
					<Buttons
						variant="primary"
						size="large"
						content="Join Us"
						href="/signup"
					/>
				</div>
			</section>
		</main>
	);
}
