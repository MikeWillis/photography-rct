import { Fragment, useState } from "react";
import { NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Field } from "../ui/field";
import { useForm } from "react-hook-form"
import {
	Container,
	Text,
	Heading,
	Grid,
	GridItem,
	Box,
	Wrap,
	WrapItem,
	Input,
	Button,
	Stack,
	Textarea,
	Skeleton,
	Spinner,
	Alert,
} from "@chakra-ui/react";

import BlurbLink from "../general/BlurbLink";
import PhotoGallerySwipe from "../myUI/PhotoGallerySwipe";
import Gallery from "./Gallery";
import AnimatedHeading from "../myUI/AnimatedHeading";

import { authActions } from "../../redux/slices/auth";

import { config } from "../../config";

import styles from "../../styles/home.module.scss";
import { default as generalStyles } from "../../styles/general.module.scss";


const Contact = props => {

	const dispatch = useDispatch();

	const [st_submitting, sst_submitting] = useState(false);
	const [st_response, sst_response] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = handleSubmit(async (data) => {
		// console.log(data);
		let grecaptcha = window.grecaptcha || false;
		if (!grecaptcha) {
			console.log("no recaptcha available??");
		} else {
			grecaptcha.ready(function () {
				grecaptcha.execute(config.recaptcha.siteKey, { action: 'submit' }).then(function (token) {
					let postForm = async () => {
						let url = `https://${config.apiDomain}/api/post/login.php`;
						let formData = new FormData();
						formData.append("recaptchaToken", token);
						Object.entries(data).forEach(
							([key, value]) => formData.append(key, value)
						);

						sst_submitting(true);
						let response = await fetch(url, {
							method: "POST",
							body: formData,
							mode: 'cors',
							// credentials: "include",
						});
						sst_submitting(false);

						if (response.ok) {
							let json = await response.json();
							// console.log("json", json);

							if ( json.status ) {
								localStorage.setItem('adminToken', json.token);

								dispatch(
									authActions.setLogin(json.token)
								);
							}
							sst_response(json);
						} else {
							console.log("invalid response");
						}
					};

					postForm();
				});
			});
		}
	});

	return (
		<Box
			className={`${generalStyles.content} ${generalStyles.content100vw}`}
			paddingLeft={config.contentIndent}
			paddingRight={config.contentIndent}
			paddingBottom="5vh"
		>
			<title>Mike Willis Photography | Contact</title>
			<AnimatedHeading heading="Contact Me" marginBottom="5vh" />

			{
				st_response && st_response.status ? (
					<Alert.Root status="success" variant="surface">
						<Alert.Indicator />
						<Alert.Title>Login successful. Admin privileges granted.</Alert.Title>
					</Alert.Root>
				) : (
					<Fragment>
						{
							st_response && !st_response.status ? (
								<Alert.Root status="error" variant="surface">
									<Alert.Indicator />
									<Alert.Title>Could not send message :(</Alert.Title>
								</Alert.Root>
							) : (
								<Fragment>
									<form onSubmit={onSubmit} style={{ marginTop: "5vh" }}>
										<Stack gap="4" align="flex-start">
											<Field
												label="Username"
												invalid={!!errors.username}
												errorText={errors.username?.message}
											>
												<Input
													{...register("username", { required: "Username is required" })}
												/>
											</Field>
											<Field
												label="Password"
												invalid={!!errors.password}
												errorText={errors.password?.message}
											>
												<Input
													type="password"
													{...register(
														"password", {
														required: "Password is required",
													})}
												/>
											</Field>

											<Button
												type="submit"
												width="100%"
												loading={st_submitting}
												loadingText="Sending..."
											>
												Send
											</Button>
										</Stack>
									</form>
								</Fragment>
							)
						}
					</Fragment >
				)
			}

		</Box >
	);
};

export default Contact;