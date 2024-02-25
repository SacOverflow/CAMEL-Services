import Image from 'next/image';
import Buttons from '@/components/SharedComponents/Buttons';

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between pt-5">
			<section id="home-section flex flex-col items-center justify-between">
				<div>
					<p className="flex justify-center text-primary-green-700 size-10"></p>
					<p className="flex justify-center text-3xl text-primary-green-700">
						Page Not Found
					</p>
				</div>
				<Image
					src={'/images/camel.svg'}
					width={0}
					height={0}
					alt="testimonial-image"
					className="w-60 h-60"
				/>
				<div className="return-to-home flex justify-center">
					<Buttons
						variant="primary"
						size="large"
						content="Return to Home"
						href="/"
					/>
				</div>
			</section>
		</main>
	);
}
