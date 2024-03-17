'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createSupbaseClient } from '@/lib/supabase/client';

// import CSS
import './Testimonial.css';

function Testimonial() {
	const [thirdCard_tes, setThirdCard_tes] = useState([]);
	const [userTest, setUserTest] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const num_rand = 5;

	// upon first render, fetch the testimonials
	useEffect(() => {
		const fetchTest = async () => {
			setIsLoading(true);
			try {
				if (!thirdCard_tes.length) {
					const supabase = await createSupbaseClient();
					const { data, error } = await supabase.rpc(
						'get_random_testimonials',
						{ limit_count: num_rand },
					);

					if (error) {
						throw error;
					}
					setThirdCard_tes(data);
				}
			} catch (error: any) {
				setError(error.message);
			} finally {
			}
		};

		fetchTest();
		setIsLoading(false);
	}, []);

	// set the userTest state to a random testimonial every 4 seconds
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (thirdCard_tes.length > 0) {
				const randomIndex = Math.floor(
					Math.random() * thirdCard_tes.length,
				);
				setUserTest(thirdCard_tes[randomIndex]);
			}
		}, 4000);

		return () => clearInterval(intervalId);
	}, [thirdCard_tes]);

	if (isLoading) {
		return <div className="text-center">Loading...</div>;
	}

	// if (error) {
	// 	return <div>Error: {error}</div>;
	// }

	const {
		id,
		created_at,
		review_content,
		user_id,
		userName,
		user_profile_link,
	} = userTest || {
		id: 12343,
		created_at: 'example',
		review_content: 'example',
		user_id: 'example',
		userName: 'example',
		user_profile_link: '/images/hashemtmp.jpeg',
	};

	return (
		<div className="flex flex-col gap-y-2 justify-center items-center overflow-y-hidden">
			<Image
				src={user_profile_link}
				width={100}
				height={100}
				alt="testimonial-image"
				className="testimonial-image"
			/>
			<h5 className="testimonial-name">{userName}</h5>
			<div className="testimonial-text">
				<p>{review_content || 'Nothing to display'}</p>
			</div>
		</div>
	);
}

export default Testimonial;
