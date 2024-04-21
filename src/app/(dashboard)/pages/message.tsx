import Image from 'next/image';
import React from 'react';

const linkify = (text: string) => {
	const urlRegex =
		/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
	return text.split(urlRegex).map((part, index) =>
		urlRegex.test(part)
			? [
					<br key={`br-pre-${index}`} />,
					<a
						key={index}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
					>
						{part}
					</a>,
					<br key={`br-post-${index}`} />,
			  ]
			: part,
	);
};

const Message = ({ text, isUser }: { text: string; isUser: boolean }) => {
	const messageStyle = {
		padding: '10px',
		borderRadius: '10px',
		margin: '5px 0',
		color: 'white',
		maxWidth: '60%',
		alignSelf: isUser ? 'flex-end' : 'flex-start',
		backgroundColor: isUser ? 'blue' : 'green',
	};

	const aiMessageStyle = {
		color: 'white',
		padding: '10px',
		borderRadius: '10px',
		margin: '5px',
	};

	// const imagePath = '../../../public/images/CAMELIA.png';
	const imagePath = '/images/camel.svg';
	// console.log(`Image path: ${imagePath}`);
	const processedText = linkify(text);
	return (
		<>
			{isUser ? (
				<div style={messageStyle}>{text}</div>
			) : (
				<div className="flex flex-row">
					<Image
						src={imagePath}
						alt={"Camelia's profile picture"}
						className="w-[50px] h-[50px] mr-2 rounded-[50%] object-cover"
						width={50}
						height={50}
					/>
					{/* <img
						src={'https://en.pimg.jp/102/478/233/1/102478233.jpg'}
						style={{
							width: '50px',
							height: '50px',
							marginRight: '10px',
							borderRadius: '50%',
							objectFit: 'cover',
						}}
					></img> */}
					<div
						style={aiMessageStyle}
						className="bg-primary-green-700"
					>
						{processedText}
					</div>
				</div>
			)}
		</>
	);
};

export default Message;
