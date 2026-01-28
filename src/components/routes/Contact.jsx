import { Fragment, useState } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
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

import { config } from "../../config";

import styles from "../../styles/home.module.scss";
import { default as generalStyles } from "../../styles/general.module.scss";


const Contact = props => {

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
			// console.log("no recaptcha available??");
		} else {
			grecaptcha.ready(function () {
				grecaptcha.execute(config.recaptcha.siteKey, { action: 'submit' }).then(function (token) {
					let postForm = async () => {
						let url = `https://${config.apiDomain}/api/post/contact.php`;
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
							sst_response(json);
						} else {
							// console.log("invalid response");
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
						<Alert.Title>Message sent! I&apos;ll get back to you as soon as I can!</Alert.Title>
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
									<Text>Use the form below if you&apos;d like to contact me for any reason!</Text>
									<form onSubmit={onSubmit} style={{ marginTop: "5vh" }}>
										<Stack gap="4" align="flex-start">
											<Field
												label="Your Name"
												invalid={!!errors.name}
												errorText={errors.name?.message}
											>
												<Input
													{...register("name", { required: "Name is required" })}
												/>
											</Field>
											<Field
												label="Email Address"
												invalid={!!errors.emailAddress}
												errorText={errors.emailAddress?.message}
											>
												<Input
													{...register(
														"emailAddress", {
														required: "Email address is required",
														pattern: {
															value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
															message: "Invalid email address"
														}
													})}
												/>
											</Field>

											<Field
												label="Message"
												invalid={!!errors.message}
												errorText={errors.message?.message}
											>
												<Textarea
													{...register("message", { required: "Message is required" })}
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