'use client';
/**
 * SO-71
 * Done by Hashem Jaber
 */

import '../../account/language/page.css';
import React, { useEffect, useState } from 'react';
import { getLangPrefOfUser } from '@/lib/actions/client';
import LanguageOption from '@/components/Account/Languages/page';
export default function Lagnuage() {
	const [userPrefLang, setUserPrefLang]: any = useState('English'); // Default language
	const dict: any = {
		viet: 'Tiếng Việt',
		english: 'English',
		spanish: 'Spanish',
	};
	useEffect(() => {
		const getLanguage = async () => {
			const langPref = await getLangPrefOfUser();
			console.log('got user info for testing and its ', langPref);
			setUserPrefLang(langPref);
		};
		getLanguage();
	}, []);
	return (
		<div className="language-section-body">
			<div className="flex justify-center items-center flex-row">
				<svg
					width="64"
					height="64"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1M16 31C7.71573 31 1 24.2843 1 16C1 7.71573 7.71573 1 16 1M16 31C20.0909 31 21.4545 24.1818 21.4545 16C21.4545 7.81818 20.0909 1 16 1M16 31C11.9091 31 10.5455 24.1818 10.5455 16C10.5455 7.81818 11.9091 1 16 1M2.36364 21.4545H29.6364M2.36364 10.5455H29.6364"
						stroke="#5A8472"
						strokeWidth="2"
					/>
				</svg>
				<h1 className="title">Languages</h1>
			</div>
			<div className="languages-options-card">
				<LanguageOption lang="english" />
				<LanguageOption lang="mexico" />
				<LanguageOption lang="viet" />
			</div>
			<div className="flex justify-center items-center flex-row">
				<h1 className="title">Selected language:</h1>
				<h2 className="title">{dict[userPrefLang]}</h2>
			</div>
		</div>
	);
}
