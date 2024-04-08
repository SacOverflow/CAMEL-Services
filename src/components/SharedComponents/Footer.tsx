import Image from 'next/image';
import { Lexend_Giga } from 'next/font/google';
import Link from 'next/link';

const Lexend_Giga_Text = Lexend_Giga({
	subsets: ['latin-ext'],
	weight: ['400'],
});

export function Footer() {
	return (
		<footer className="bg-primary-green-500">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="mb-6 md:mb-0">
						<a className="flex items-center">
							<Image
								src="/images/camel.svg"
								alt="CAMEL Logo"
								width={80}
								height={80}
								className="h-20 me-1"
							/>
							<span
								className={`self-center text-4xl ${Lexend_Giga_Text.className} whitespace-nowrap text-white`}
							>
								CAMEL
							</span>
						</a>
					</div>
					<div className="grid grid-cols-2 gap-16 md:grid-cols-2">
						<div>
							<h2
								className={`mb-4 text-med ${Lexend_Giga_Text.className} font-bold text-primary-green-900`}
							>
								Members
							</h2>
							<ul className="text-white font-medium">
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/jvniorrr`}
										target="_blank"
									>
										Fernando Mendoza
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/hashemJaber`}
										target="_blank"
									>
										Hashem Jaber
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/RealHoltz`}
										target="_blank"
									>
										Jacob Correa
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/JDoan03`}
										target="_blank"
									>
										Joseph Doan
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/Miguel1357`}
										target="_blank"
									>
										Miguel Lopez
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/imrenmore`}
										target="_blank"
									>
										Imren More
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/KiranKaur3`}
										target="_blank"
									>
										Kiranjot Kaur
									</Link>
								</li>
								<li className="mb-2 hover:underline">
									<Link
										href={`https://github.com/DGConn`}
										target="_blank"
									>
										Dakota Conn
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2
								className={`mb-4 text-med ${Lexend_Giga_Text.className} font-bold text-primary-green-900`}
							>
								Resources
							</h2>
							<ul className="text-white font-medium">
								<li className="mb-2">
									<a
										href="https://github.com/SacOverflow/CAMEL-Services"
										className="hover:underline"
										target="_blank"
									>
										Github
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="text-sm text-white sm:text-left">
					{' '}
					© 2024 Camel™. All Rights Reserved.
				</div>
			</div>
		</footer>
	);
}

// export Footer;
