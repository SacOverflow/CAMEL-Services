'use client';
import Image from 'next/image';
import './Loader.css';

export default function Loader() {
	const images = Array.from(
		{ length: 11 },
		(_, i) => `/images/camel_outline_00/camel_outline_${i * 10}.svg`,
	);

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.style.display = 'none';
	};

	return (
		<div className="loader">
			{images.map((src, index) => (
				<Image
					key={index}
					src={src}
					alt={`${index * 10}%`}
					width={200}
					height={200}
					className={`loader-image image-${index}`}
					onError={handleImageError}
				/>
			))}
			<span className="loader-text">CAMEL Loading</span>
		</div>
	);
}
