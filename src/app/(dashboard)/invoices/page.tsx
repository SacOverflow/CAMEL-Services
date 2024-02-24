'use client';

import React, { useState, useEffect } from 'react';
import ItemsTable from './itemsList';
import { env } from 'process';
import { insertReceipts } from '@/lib/actions/client';
import { createSupbaseClient } from '@/lib/supabase/client';
interface IReceipts {
	id: string;
	proj_id: string;
	org_id: string;
	img_id: string;
	store: string;
	category: string;
	updated_by: string;
	updated_at: Date;
	created_by: string;
	created_at: Date;
	price_total: number;
	note?: string;
}
//FIX ME: REFIX/RETHINK DEFUALT IMAGE
const DEFAULT_IMAGE ='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBESERgSEREQEhESERESEhISEREREREPGBQZGRkUGBgcIS4lHB4rIRgaJjgmKzAxNTU1GiU+QDs0Py41NTEBDAwMDw8PGBEPGDEdGCE0MTExMTE0MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwABBAUGB//EAEYQAAICAQIDBgMEBgcECwAAAAECABEDEiEEIjEFEzJBUWFxkbEjUnKBFEJiobLBBjNzgrTR8DRjdLMkNUNTg4WSosTh8f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD1SrGqsirGKsCKsYqy1WGqwIqwgsJVhhYAhYYWEi7j4ia+6HpAxhYQWaxhHpC7oekDIFl6ZrGESxhHpAyaZNM2dyJO6HpAx6ZNM3DCPTrL7ldtukDn6ZRWdIYF326/62k/R12FdP8AW8DllYJWdj9HSydI329pX6KlVXnd+fzgccrAKzu/oyatWkdKry+UH9Cx6dNdTd3zfOBwSsFlm7tBFXJpUAAIpofFt/3TKywM7LFss0MsBlgZmWKZZpZYtlgI0yRmmSA9VjVWUojFWBFWNVZFEYqwIqwgstVjAsCkXcfETcFmVF3HxE3KIFKsMJLVYYEAAklD/XpGVPMcZ2VlbNxLY8I08RwudC+TuSzZmxoiLjcHWqEKdStsCAR5wPSaZVDrtXrc83m7G4gjMCxy614DxnGnepiyM2TAdIAAK2u431b7QD2HkfGyjFjxY345MyYHXHkTDhGFUa0B0klwzaVJHP63A9RUlTkcf2QG4JOEXVkRTwmNtbAM2FMuMuSfXSrH6TnDsri2xZMOQI/fcXj7x3YFcvC48ONdTqKNucQUqPvnygeqlWPUTyubs3jK4d1VTxHC8Pmw6iygM7Njxhzv0KBsleqgdYCdgui8Mgxa04fNxh0j9HcrjbiNWI1k28NWRzD4wPXS4JaVqgHJcXqld5A5XaB/6QR/uk/ieJZYfGtfE/8AhL/E0tlgIZYplmlli2EDOyxTLNDLFssBOmSHpkgPURiiUojVEC1ENRKURqiBFEMCRRGAQIg+omwTIRt+Y+s1wCEIGAJdwMo4Gqp35SSL+8Q1naupYk/ykHB0FAd6UFatgDyBR0I6Vf5n4zVchMDIjqjEM53KoNWwZyB0386/f864dFaiMjGguw1KNiK2v9k/nq+A0sqncgE3d0Luqv5RSY0XwqBZJ2HqSf5wM6BVAY5MraV1blt1VySSCeu9H2g5a1Ed463qQAXs9nIT1o7EfLfbaPdFIoqpHoQCOt/UAwDjT7q9WPQeJup+JgIbKjf9q+5BFFhXeeEbHcir9gb6TTmXUQSV5Q/VbFsK9bAonb/6iTiT7ifq/qr+r0+UstAo4hpC2eVCgJAPKVC/LYbRmN9Khb8IA+QiS0EmA85oJzTOTBJgKd74gH/dgfvM1sJgX+vX8P8AnOkwgIYQGEewimEBDCLYTQwimEBNSQqkgPURiiUojFEAlENRIohqIFqIxRKUQwIAsNvzH1mmZ8vh/NfrNEBT4L187jWANmrRQ6p6GW2KyTqcakCUGNL15h6Nv19hGSQFriog6nOlNFFtj05j6tt194HdhApLvWNSCWfZhXV/XpHxPE4y60CAQyMCRqFqwO4sX0gLCKAp7xyEJyWXvUravEfNd9vgJXdqQKdyC/eAh7u+bTf3fb0i8nBFmZy9ll0FdNKFGkiqIYEMCQdW2o/GUnBUyuzszKVJPMAxGNsZJUGr5ruBHVOcHIw5lZvtADj6Uv7INdPcwcoQ67yFdaA7OBoQba19OvWBm7P1MzByC7K24bl0ujbUwIvRv+XSt4/CMQ41ishRvC2oOoQeLVdcnx36wLcIbPeEB1CCsgqzZBX9o3+4QUCk2rltK6CA9jy3av1tuvxg5OCDeJiRqDMBY1Du9BUm7rzjkx0WN+JtXTpygV+6ApcNaeZzoBG7Xqvzb1MAYK087nSxbdvFd7N6jf8AcJpMEwM5w7Vqfx6/Fv1vT+H2hGGYJgZ0H26/h/znTYTnYx9uv4f851GEBDCAwjmEBhAzsIthHsIthATUkOpIDFEaogKI5RAtRGqICiNUQLURgEFRGAQFcR4fzX6iPiOK8P8AeX+IR8DIHxvrC5TzHuzpeijqDYX0Ox+UstjJJ7zxoq0MgoKdVMvud9/OpjODhtQOgs3eO452ch9TEgam23s10BI6WJMePh02XG9I7jxMQrY0KFqLfdYgfAegga+8xrTHL0QoAcnXl12R1L6VJ9aBloEBQd4SUvGAcgJdqFhh+sw2P5xK9kYRdqx1He3fw6HTSKPTS7j+9fXeGOzsIbUE5tZyXqc85dXJG+3MoNdPmYDVwAaeZzpZm3cksTezeo36ewgnAKrU/j7zxm7u9N/d9o8wTAQ+AHVzPzMG2ciiK2HoNunuYGTADq5nGsAGmI01930mgwTAzviBJOpxqTRsxoDfceh36yu6Fg6n2TRWo0RtzH1O3WOMEwEJhA08znQCBbE6r829TtEt3aFEbIwa3dAz7vQOq/UDV9JrMz8TwmPIbdAxCPjBN2EcAOB6WAN+sBJ7uv6w1rOSzkrYUxF/c3HtuI8zJxPC4m1lkskcw1sBkoK42vyI/d7zYEAFAUAKAHkBAXw6/bD8H+c6TCY+FT7Qn0QfUzcwgKYRTCPYRTCAlhFMI9hFMIC6lQ5IDFjVi1jFgMWMWAsYsA1EMQVjBAz8b4R+NP4hHRHH+Ffxp9Y+BlV8tnwFQ1XtuLHnfoW8vISwcxo/ZgWuobmxW9G/Xp7GIKIOYu6gszA0KKqbJ2HTerO5BrzhYjjRgdbXekBrFMxNCq68pHsBXlA3XKMwo2NCpLttQXUrbhtZFbe/X2HrKx4sdrzuW1KRdg3bPuK2ve/hA2mUYrh+GGPoWPKq2xsmixsn+8Y0wBMoyzKMADKMIyjAAiCRDqURAyZC/PXsF3Tl23O/x6H0946pnylPtCXIpVD15DegPeyenn7zUgFCulCvhAZwa8zH2A+s0tE8IN2/KPaAlhAYRrRbQEsIthGtFtAXJLkgMWMWLWNWAxYxYCw1gMWGICwxAzdodF/Gv1jzM3aR8H9ov1mkwOe7N/3C3qyEWo3Ujrte7XvddIQyWxPcjZ2XVW50uAG6e7H57x7tk5tKoaA7u2I1NW+rbYfOWzPZpVrQCp1EEvvynbYdN/jAzhqo9yoFKelaOZgR4fIG/wAzUBMvKrphGplbcAcpQEKDsD6j5j46lZ7FqtaLbmNh9uUbbjrvIjZOXUqCwe8pidLVsF23HX0gTG7EtqWqYhevMtneEYtWeltUBLNrpydKb0RtufD8zK1ZK8KX3leM13d+Lp1ry9YDDKMWzPzUqbOoXnI1JtZO2x8W3sJTs/NpVDQHd2xGpq31bbDp6wGSoDF7NKpGi1JYgl99jtsOm/xkBexarWi2Oo2H25RtuOu8ApREBC/LqVBYPeUxOltq07bjrKUvy2qAljr5ydKb0Rtuem3xgJyFufkUkadJKOQw8waFk9em24948DbpWw29PaDb14UvXXiNd3fi6da8o2oDOF6n8o5orhup/L+ca0BbRbRjRbQFNFtGtFNACSSSAaxqxSxiwHLDWLWMWAxYYgLDEDF2md0/GPrNRmPtQ8yfiH1E2GBw27Ry4+/Z2R1xcRjxJqHdIiOmJi7vvyjvDZr9WCnbjbs6IifoWLilVnYPrdnDL4fAKW2rbUCeu3TL5R0AJvJZJWhQ5dIBGxNdd/rGYDk3115EV1Bs2PfygYOze0XzOhK6FfDlYpYanTMEsN5ggE/nOpJckCjKMsyjAqVLkgVJLkgVU4fHdo5sYzb46TLhRHK6Ux4nUEs5ZqJ99gCRsa37krJek6bLUaAIBv4nYQOL2h2qV4ZMqMiN9m2RMmhcoD4i4QITXeHlpb9Z2V3AO4sA0RRHxiB3tNuSeSiO7BG/NQ6Daut735TQgNC6uhddL84B4Op/KMaBi6n8obQFtFtGNFtAW0U0Y0W0AJJJIBLGrErGKYD1hrFKYxYDVjBFLGCBzu0zzp+IfUTcZz+0z9onxX+KdAwMh4QeTEEa6IAB5yCSfU7dTBbgzQ0u1greokgqFAr91/mfjKZsLh7bZiceS2dN0WyB0qhvYh3jYub/AFAj8zABKJG17eI79flAbgx6F02zbndiSTGTMO7BG41KhxgFm2Wgaq+vTfrLw4k0oyXpVPszqc8jAdbO+1dYGiUYleHQaQAeRmdeZjzG7J338R2Mn6MlVRrX3nibx3d9el+XSA2SKPDIdVg87q7czeIVRG+3hGw2+ct+GRtVg/aAB+ZhYHSqO3XyqAypcW2BSSSDbJobmYcm+3XbqdxvLGJAQfNU0Dmbw7bVe52G/WAdSVFpw6Lpq/swVTnY0D5Gzv085E4dBpAvkZmXnY8xu7336nY/ygA/CA69/wCs03t9268+u/7o9V2rrt+cyk4QKJYDU+Wj3l6lbmPz/V9+k2iBSdT+UtpQ6n4D+cjGADRbQ2i2gLaLaMaKaAMkqSASmNUzOpjlMBymMUxKmMUwGqYwGJUxgMDm9on7VPiv8U6RnJ48/bL8U+s6xgczJlQElsJv7ZhsbKAC2/MHoelGNDjf7IjWwVjRGr9o7dPc+/SOyO41VjB0gaOcDvDW4/ZlPkYE0lgJanUOZ9+X28t/eAhGUmhiZddliQQRbb36Hof/AMhrnKigjUC6hVVrVU2A362Nx5V6+ZDK1i0oFLJ1Dlfbk9/Pf2lJmc6bQDUCX5we7NbD9qBfD52YkFGWr5v1TzECr36C5omZcz8toBbENzg6F3pve6G3vJ3z14N9emtY8F+O/hvUDSJYmY5X5qS6ZQvOBqTa29qs7e0J8jjVSXpAKc4Gs1uP2fzgaJNI9B8v9eg+USzvZpAQEtTqA1Pvye3lv7wld7HJQKWTqHK+3J7+e/tArI5Dqq49QbUS/QIQNr284sZz10b/AGe2lgQX8Q96vr7nzjUdzpvHWpSX5we7bah+1LV35bx1bMG5wdCb03vdDb3gZNQ00cBK0wCMGauerIO3Tf57+vRToNq2G1VXtUUHevBv3mmtY8F+L5b1NAgKPU/AfzgsZb+I/AfzgMYFMYpjDYxTGBTGJYxjGJYwKuXBuVAJTGKYhTGKYGhTGKYhTGKYD1MIGKUxgMDlcY324/En1nXZpw+Jb7cfjT6idrJAU7xTZJMkUYFnJIMky8VxWPEpbIwVQruTRNKilmOw8gLmPiO3uExqrZMwVciJkQ6HOpGBKtsu10YGzieKyI3KmtdAagrai2tV03ddCT+UQe0824GBr7p2BYNp78FtKEi9tK2SL6ipG7a4VWRDlAbKQMY0vzkkADpt4h19YA/pFwfdd936913nd69GSu806tNab6bwNPC9o5HdFbC6K+vUzK3Iyu6hD7kIDfT33W5xHaGdFYjECVfIigDI+sKhda0jbVst9Ab67CXl7Y4bGyI+UK2R1xoNLnU7BCF2G2zp19ZfGdt8Lh/rcoTfTujnmthWw/Yb5QHYeNdshTuyArlSxDgadWQAg1RtUQ7ff+E6IM5SdvcIX7sZhrAUldD9GXUP1fSHk7d4RAhfMoDhinI51BUVz0G3K6nf1gdQGEJj4btHDkc40cM63qWmBFJjc9R93NjP9/4zYIBCGIIhCBnyHnP4V+pgsZMx5z+FfqYDGALGAxlsYtjAFjFsZbGLYwJckC5IEUxqmZ1MapgPUximIUximA5TGAxKmEDA5WZvt/76/UTuuJ51m+3H41/iE9I6wMjiLImh1iisDzn9LB9g/wDw3Gf4dp4v+kv9Twv/AAfC/wAGSfUOJ4XHkBXIiupVlIYWCrLpYfAg1M2bsXhcgVcnD4nVFVEDICFRb0qPQCz84HheMH/SeB/tMf8AHjnLP/VP/mX/AMafU27I4YsjHDjLYyDjJQE4yCCCvp0HygjsHhO77v8ARsPd6+87vuxo16dOqvWtoHje3v8AaOF/4zB/yuEiP6cef9qP4uJn0DJ2Vw7lWfDjZsbB0JUEo4CgMPQgIv8A6RL4nsfhsv8AWYMeTe+dA2/Nv/7m+ZgfO8H+2N+DB/yTGdr+DhfwcR/guHn0FexuFDaxgxazQLaBZAFDf2G0J+yOGbSGwYm7sEJaA6AUVDXpaqo+AEDgf0c/23L+LJ/g+zJ68TNh4PEjF0xortdsFAY2qKbPwx4x/cHpNEAwZYMC5NUBGY85/Cv1MUxl5j9ofwr9TAYwKYxbGWxi2MCmMUxhMYpjAlyQLkgRTGKZnVoxWgaFMYrTOrRitA0K0MNEK0MNA5KH7Yf2i/xCepbKmpl1rqUWwvdR6mcoYUu9IuNVF+6PlA0PmTSG1rpY0DexPpBLLq02NQFkeYEAKvoPlCAHoIAl0rVqFXV+8IEXViyLr2lgD0ELb0EAA61dihsT7wwy2BYs7j3Evb0Em0CxkXfccvX2l94u245vD7wSR7SbQC1rvuOXxe0nepQOoUxoH1MDaUa9BAb3i2RYsCyPQQTxCadWoaSaB8r9Io16CCQPQQNByrq02NVXXnUX+lY9OrWukGib2v0iSB6CAQPQfKAzI3OT+yv84tjBuCzQIxi2MjNFs0CMYtjIzRTNAK5IvVLgCrRitMytGq0DQrRitMytGK0DQrRgaZ1aGGgPDQw0QGhhoDg0INEBoQaBhD8XrHKNJ0hrKUrBjekBrK6SdyQ2y+4gvxPFrptDbECgEffWotqICjSWO3oPQ30tUvVAwu/FhqCoygeIaAT4r5Seo5a3rrfqLZuJAUrd/aai/dlVvJsXAa9kvZb3AHx3apNUDh9v4uKz8ICi5A7h+8w43RMmh1Ogam/WQ6CRYvSw84H6Nxw4bEVd+/Rs2R8b5NVnu37rE7B+YBtAO5BO5nf1SaoHEbN2kHIGPCyDKFD8gLYrfnrWOoCWOoJNWOmLHn7TyLjyjGAdIYqxGK1ZELAprINEvpDUbADaRZPp9UotAPVBLQC0EtAMtALSi0AtAItFs0otAZoEZoDNKZotmgWzRbNIzRTNALVJF6pIEWMWSSAxYxZJIBrDEkkAxDEkkAhLEuSBckkkC5ckkCSpJIFSSSQBMoypIAmCZJIAGAZJIC2gNJJAW0W0kkAJJJIH/9k='

const ReceiptPage = () => {
	const [receiptFile, setReceiptFile] = useState<File | null>(null);
	const [receiptData, setReceiptData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [items, setItems] = useState([]);
	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(DEFAULT_IMAGE);
	const [errorRe, setErrorMessage] = useState<{
		error: Boolean;
		errorMessage: string;
		errorCode: string | number;
	}>({ error: false, errorMessage: 'No error for now', errorCode: 100 });
	//FIXME: EXTRACT PROJECT_ID AMD org_id dyncmically -Hashem Jaber

	const [reciept, setReciept] = useState<IReceipts | any>({
		proj_id: 'a7188d51-4ea8-492e-9277-7989551a3b97',
		org_id: 'a210d3f7-bcc8-4e8b-9d61-2d4228bff047',
		img_id: 'some-img-id',
		store: 'store',
		category: 'category',
		updated_by: 'some-user',
		updated_at: new Date(),
		created_by: 'cd1d7916-a61a-40fa-9691-c29e42c8988a',
		created_at: new Date(),
		price_total: 100.0,
		note: '',
	});

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>,
	) => {
		const { name, value } = event.target;

		// Create a new object for the state update
		setReciept((prevReciept: any) => ({
			...prevReciept, // Spread the previous state
			[name]: name === 'price_total' ? parseFloat(value) : value, // Ensure numbers are handled correctly
		}));
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setReceiptFile(event.target.files ? event.target.files[0] : null);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!receiptFile) {
			setError('Please select a file to upload.');
			return;
		}

		setLoading(true);
		const form = new FormData();
		form.append('file', receiptFile);
		form.append('refresh', 'false');
		form.append('incognito', 'false');
		form.append('extractTime', 'false');
		form.append('extractLineItems', 'true');

		const options: any = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				apikey: process.env.NEXT_PUBLIC_TAGGUN_KEY,
			},
			body: form,
		};

		fetch('https://api.taggun.io/api/receipt/v1/verbose/file', options)
			.then(response => response.json())
			.then(response => {
				function extractItemsInfo(receiptJson: any) {
					const items = receiptJson.entities?.productLineItems || [];
					const extractedInfo = items.map((item: any) => {
						const itemData = item.data;
						const itemName = itemData.name?.text || 'Unknown item';
						const quantity = itemData.quantity?.data || 0;
						const unitPrice = itemData.unitPrice?.data || 0.0;
						const totalPrice = itemData.totalPrice?.data || 0.0;

						return {
							Item: itemName,
							Quantity: quantity,
							UnitPrice: `$${unitPrice.toFixed(2)}`,
							TotalPrice: `$${totalPrice.toFixed(2)}`,
						};
					});

					return extractedInfo;
				}

				// Extract items info
				const itemsInfo = extractItemsInfo(response);
				const tmps: any = [];

				itemsInfo.forEach((item: any) => {
					try {
						/*	console.log(
							`Item: ${item.Item}, Quantity: ${item.Quantity}, Unit Price: ${item.UnitPrice}, Total Price: ${item.TotalPrice}`,
						);
*/
						tmps.push({
							item: item.Item,
							Quantity: item.Quantity,
							price: item.UnitPrice,
							total_price: item.TotalPrice,
						});
						setItems(tmps);
					} catch (e: any) {
						console.error('failed due to\n:' + e);
					}
				});

				setReceiptData(response);
				setLoading(false);
				console.info(JSON.stringify(response));
			})
			.catch((err: any) => {
				console.error(err);
				setError(
					'An error occurred while processing the receipt., error details: ',
				);
				setLoading(false);
			});
	};

	const handleSubmitForm = async (e: any) => {
		e.preventDefault();

		// upload image
		await createReciept(e);
	};
	const createReciept = async (e: any) => {
		// create org using user auth
		const supabase = await createSupbaseClient();

		// user info
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		error
			? setErrorMessage({
					error: true,
					errorMessage:
						'failed to extract user info, are you sure your signed in?',
					errorCode: 400,
			  })
			: () => {};
		let newURL = null;

		if (imageURL !== DEFAULT_IMAGE) {
			// create custom hash for image
			const hash = Math.random().toString(36).substring(2);
			// upload image to storage
			const { data, error } = await supabase.storage
				.from('profile-avatars')
				.upload(`public/${hash}`, image, {
					cacheControl: '3600',
				});

			if (error) {
				console.error(error);
				setErrorMessage({
					error: true,
					errorMessage:
						'failed to upload imaage of reciept, please try again',
					errorCode: 400,
				});
				return;
			}

			// get image url
			const {
				data: { publicUrl },
			} = supabase.storage
				.from('profile-avatars')
				.getPublicUrl(data?.path as string);

			newURL = publicUrl;

			setImageURL(publicUrl);
		}
		reciept.created_by = user?.id;
		// query to create new row entry
		const { data: entryData, error: entryError } = await supabase
			.from('receipts')
			.insert([
				{
					...reciept,
					image: newURL || imageURL,
				},
			]);

		entryError
			? setErrorMessage({
					error: true,
					errorMessage: entryError?.message,
					errorCode: entryError?.code,
			  })
			: setErrorMessage({
					error: false,
					errorMessage: 'no errors to report',
					errorCode: 200,
			  });
		entryError
			? setError('Reciept creation failed due to unknown ')
			: setErrorMessage({
					error: false,
					errorMessage: 'no errors to report',
					errorCode: 200,
			  });

		if (
			entryError?.message ===
				'duplicate key value violates unique constraint "organization_name_key"' ||
			entryError?.code === '23505'
		) {
			setErrorMessage({
				error: true,
				errorMessage:
					'failed to upload reciept, please try again, error detail: duplicate key value violates unique constrainty ',
				errorCode: 23505,
			});
			return;
		}
		/*if (clickHandler) {
			clickHandler();
			router.refresh();
		}*/
	};

	return (
		<>
			<div
				style={{
					background: 'white',
					margin: 'auto',
					width: '50%',
					padding: '10px',
					border: '1px grey',
					borderRadius: '8px',
					marginTop: '20px',
				}}
			>
				<h1 style={{ textAlign: 'center' }}>Upload Receipt</h1>

				<form onSubmit={handleSubmit}>
					<input
						type="file"
						onChange={handleFileChange}
						className="mb-4"
					/>
					<button
						type="submit"
						className="bg-green-500 hover:bg-blue-200 text-green font-bold py-2 px-4 rounded"
						disabled={loading}
						style={{
							padding: '10px',
							backgroundColor: '#5A8472',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
					>
						{loading ? 'Processing...' : 'Upload'}
					</button>
				</form>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					<button
						style={{
							padding: '10px',
							backgroundColor: '#5A8472',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
					>
						Scan Receipt
					</button>
					<input
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
						placeholder="Store"
						value={reciept?.store}
						name="store"
						onChange={handleChange}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
						}}
					>
						<input
							style={{
								flex: 1,
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
							}}
							placeholder="Price/Total"
							type="number"
							onChange={handleChange}
							name="price_total"
							value={reciept?.price_total}
						/>
						<select
							style={{
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
							}}
						>
							<option value="USD">USD</option>
							{/* Add other currencies as needed */}
						</select>
					</div>
					<input
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
						placeholder="MM/DD/YYYY"
						type="date"
					/>
					<textarea
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							minHeight: '100px',
						}}
						placeholder="Notes"
						name="note"
						value={reciept?.note}
						onChange={handleChange}
					/>
					<div style={{ display: 'flex', gap: '10px' }}>
						<button
							style={{
								flex: 1,
								padding: '10px',
								backgroundColor: 'white',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							Cancel
						</button>
						<button
							style={{
								flex: 1,
								padding: '10px',
								backgroundColor: '#5A8472',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
							onClick={() => {
								//	alert(JSON.stringify(reciept));

								insertReceipts(reciept).then((res: any) => {
									res ? alert('worked') : alert('failed');
								});
							}}
						>
							Submit
						</button>
					</div>
					{errorRe.errorCode === 200 && (
						<span>Receipt uplaoded succesfully 🎉🥳 ! </span>
					)}
					{errorRe.error && (
						<span>
							Oops something went wrong: errorCode:{' '}
							{errorRe.errorCode} {'\n'} error Message:{' '}
							{errorRe.errorMessage}{' '}
						</span>
					)}
				</div>
			</div>
			{receiptData && (
				<div className="mt-4">
					<h3 className="text-xl font-bold">Receipt Data:</h3>
					<pre>{JSON.stringify(receiptData, null, 2)}</pre>
				</div>
			)}
		</>
	);

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Upload Receipt</h2>
			{error && <p className="text-red-500">{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					onChange={handleFileChange}
					className="mb-4"
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					disabled={loading}
				>
					{loading ? 'Processing...' : 'Upload'}
				</button>
			</form>
		</div>
	);
};

export default ReceiptPage;
