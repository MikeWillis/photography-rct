import { Fragment, useState, useEffect, useCallback } from "react";
import { 
	Grid,
	Box, 
	Button, 
	Popover, 
	Text, 
	VStack, 
	Heading, 
	Flex,
	IconButton,
	Portal,
	Input,

	createListCollection,
} from "@chakra-ui/react";
import { FaGear, FaXmark } from "react-icons/fa6";
import { useDispatch } from "react-redux";

import { Field } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { toaster } from "../ui/toaster";
import {
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from "../ui/select";
import {
	DialogRoot,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogActionTrigger,
} from "../ui/dialog";

import DebouncedInput from "../form/DebouncedInput";

import { authActions } from "../../redux/slices/auth";
import { galleriesActions } from "../../redux/slices/galleries";

import { config } from "../../config";

const AdminSelect = props=>{
	let {
		value,
		setValue,
		options,
		label,
	} = props;

	const listOptions = createListCollection({
		items: options,
	});

	return (
		<Box width="50%">
			<Field
				label={label}
				orientation="horizontal"
			>
				<SelectRoot
					collection={listOptions}
					size="sm"
					width="200px"
					value={[value]}
					onValueChange={event => {
						setValue(event.value[0]);
					}}
				>
					<SelectTrigger>
						<SelectValueText placeholder="Choose" />
					</SelectTrigger>
					<SelectContent>
						{
							listOptions.items.map((listOption) => {
								return (
									<SelectItem item={listOption} key={listOption.value}>
										{listOption.label}
									</SelectItem>
								)
							})
						}
					</SelectContent>
				</SelectRoot>
			</Field>
		</Box>
	);
}; // AdminSelect

const AdminInput = props=>{
	let {
		label,
		value,
		setValue,
		placeholder,
		onDebounceStart,
		onDebounceComplete
	} = props;

	// console.log("AdminInput rendering, props:",props);

	return (
		<Field 
			label={label} 
			orientation="horizontal" 
			gap={4}
		>
			<DebouncedInput
				placeholder={placeholder}
				startVal={value}
				value={value}
				onChange={value=>setValue(value)}
				width="300px"
				onStart={onDebounceStart}
				onComplete={onDebounceComplete}
			/>
		</Field>
	);
}; // AdminInput

const AdminTools = props=>{
	let {
		image,
		onClose
	} = props;

	const dispatch = useDispatch();

	const [st_debouncing, sst_debouncing] = useState(false);
	const [st_loading, sst_loading] = useState(false);
	
	// Since these depend on 'image', we handle the null check inside the initial state
	const [st_isOpen, sst_isOpen] = useState(!!image);
	const [st_visibilityChecked, sst_visibilityChecked] = useState(image?.Visible === 1 || image?.Visible === true);
	const [st_favoriteChecked, sst_favoriteChecked] = useState(image?.isFavorite || false);
	const [st_myRating, sst_myRating] = useState(image?.myRating || null);
	const [st_visibility, sst_visibility] = useState(image?.Visibility || null);
	const [st_animalCommon, sst_animalCommon] = useState(()=>{
		let animalCommon = image?.AnimalCommon || null;
		// console.log("sst_animalCommon initial run sending back:", animalCommon);
		return animalCommon;
	});
	const [st_animalScientific, sst_animalScientific] = useState(image?.AnimalScientific || null);
	const [st_notes, sst_notes] = useState(image?.Notes || null);

	const handleDebounceStart = useCallback(()=>{sst_debouncing(true)}, []);
	const handleDebounceComplete = useCallback(()=>{sst_debouncing(false)}, []);

	// console.log("AdminTools rendering, props,st_animalCommon:",props,st_animalCommon);

	useEffect(()=>{
		// console.log("AdminTools useEffect image change, image:",image);
		sst_visibilityChecked(image?.Visible === 1 || image?.Visible === true);
		sst_favoriteChecked(image?.isFavorite || false);
		sst_myRating(image?.myRating || null);
		sst_visibility(image?.Visibility || null);
		sst_animalCommon(()=>{
			let animalCommon = image?.AnimalCommon || null;
			// console.log("AdminTools useEffect setting animalCommon:",animalCommon);
			return animalCommon;
		});
		sst_animalScientific(image?.AnimalScientific || null);
		sst_notes(image?.Notes || null);
	}, [image]);

	if (!image) return null;

	let saveChanges = async event=>{
		event.preventDefault();

		let token = localStorage.getItem('adminToken');
		let url = `https://${config.apiDomain}/api/post/admin.php`;

		const formData = new FormData();
		formData.append("adminToken", token);
		formData.append("imageID", image.ImageID);

		formData.append("visible", st_visibilityChecked);
		formData.append("isFavorite", st_favoriteChecked);
		formData.append("myRating", st_myRating);
		formData.append("visibility", st_visibility);
		formData.append("animalCommon", st_animalCommon);
		formData.append("animalScientific", st_animalScientific);
		formData.append("notes", st_notes);
		
		try {
			sst_loading(true);
			let response = await fetch(url, {
				method: 'POST',
				body: formData,
				mode: 'cors',
			});
			sst_loading(false);

			let responseJSON = await response.json();

			// console.log("response",response);
			// console.log("responseJSON",responseJSON);

			if (response.status === 401) {
				dispatch(authActions.setLogout());
				// window.location.href = '/';
				toaster.create({
					title: "Error",
					description: "Access Denied.",
					type: "error",
				});
			} else {
				// console.log("response",response);
				if ( responseJSON.status ) {
					toaster.create({
						title: "Changes saved.",
						description: "The gallery has been updated successfully.",
						type: "success",
						duration: 5000,
					});
					dispatch(galleriesActions.updateImage({
						ImageID: image.ImageID,
						Visible: st_visibilityChecked,
						isFavorite: st_favoriteChecked,
						myRating: st_myRating,
						Visibility: st_visibility,
						AnimalCommon: st_animalCommon,
						AnimalScientific: st_animalScientific,
						Notes: st_notes,
					}));

					handleOpenChange(false);
				} else {
					toaster.create({
						title: "Error",
						description: "Failed to save changes. Check the console.",
						type: "error",
					});
				}

				// it's also quite likely that our server has refreshed the token
				const refreshedToken = response.headers.get('X-Refreshed-Token');
    		if ( refreshedToken ) {
					localStorage.setItem('adminToken', refreshedToken);
					dispatch( authActions.setLogin(refreshedToken) );
				}
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	}; // saveChanges

	let handleOpenChange = (isOpen)=>{
		sst_isOpen(isOpen);
		if ( !isOpen ) {
			onClose();
		}
	}; // handleOpenChange

	// console.log("image",image);

	return (
		<DialogRoot 
			open={!!image} 
			onOpenChange={event=>handleOpenChange(event.open)}
			size="xl"
		>
			<DialogContent>
				<DialogHeader>Administation</DialogHeader>
				<DialogBody>
					<Grid
						templateColumns="repeat(2, 1fr)"
						gap="4"
					>
						<Box><b>FilePath:</b> {image.FilePath}{image.FileName}</Box>
						<Box><b>image ID:</b> {image.ImageID}</Box>
						<Box><b>trip:</b> {image.trip}</Box>
					</Grid>

					<Grid
						templateColumns="repeat(2, 1fr)"
						gap="6"
						margin="10px"
						padding="5px"
						border="1px solid #ccc"
					>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}><b>Visible?</b> <Checkbox checked={st_visibilityChecked} onCheckedChange={event=>sst_visibilityChecked(!!event.checked)} /></Box>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}><b>Favorite?</b> <Checkbox checked={st_favoriteChecked} onCheckedChange={event=>sst_favoriteChecked(!!event.checked)} /></Box>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}>
							<AdminSelect
								label="My Rating"
								value={st_myRating}
								setValue={sst_myRating}
								options={[
									{label: "0", value:0},
									{label: "1", value:1},
									{label: "2", value:2},
									{label: "3", value:3},
									{label: "4", value:4},
									{label: "5", value:5},
								]}
							/>
						</Box>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}>
							<AdminSelect
								label="Visibility"
								value={st_visibility}
								setValue={sst_visibility}
								options={[
									{label: "all", value: "all"},
									{label: "admin", value: "admin"},
									{label: "trip", value: "trip"},
								]}
							/>
						</Box>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}><AdminInput label="Animal Common" value={st_animalCommon} setValue={sst_animalCommon} placeholder="" onDebounceStart={handleDebounceStart} onDebounceComplete={handleDebounceComplete} /></Box>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}><AdminInput label="Animal Scientific" value={st_animalScientific} setValue={sst_animalScientific} placeholder="" onDebounceStart={handleDebounceStart} onDebounceComplete={handleDebounceComplete} 	/></Box>
						<Box style={{borderBottom:"1px solid #ccc",padding:"2px"}}><AdminInput label="Notes" value={st_notes} setValue={sst_notes} placeholder="" onDebounceStart={handleDebounceStart} onDebounceComplete={handleDebounceComplete} 	/></Box>
					</Grid>
					
					<Button
						colorPalette="blue"
						onClick={saveChanges}
						loading={st_loading || st_debouncing}
						loadingText={st_loading ? "Saving" : "Debouncing"}
						width="100%"
					>
						Save Changes
					</Button>
				</DialogBody>
				<DialogActionTrigger asChild>
					<Button variant="outline" onClick={onClose}>Cancel</Button>
				</DialogActionTrigger>
			</DialogContent>
		</DialogRoot>
	);
};

export default AdminTools;